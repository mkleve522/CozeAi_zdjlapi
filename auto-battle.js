// 自动攻击 + 自动吃药脚本
// 说明：
// 1. 技能、普攻、吃药默认使用点击屏幕按钮
// 2. 低血量/低体力检测默认基于状态条取色
// 3. 坐标优先使用百分比，便于多分辨率适配

const config = {
  loopInterval: 60,

  // 普攻按钮坐标
  normalAttackButton: {
    x: '88%',
    y: '78%',
  },

  // 低血量/低体力时使用的药品按钮坐标
  hpPotionButton: {
    x: '76%',
    y: '88%',
  },
  spPotionButton: {
    x: '84%',
    y: '88%',
  },

  // 吃药后的公共等待，避免连吃
  potionBackswing: 600,

  // 技能配置：priority 越小优先级越高
  skills: [
    { name: '技能1', x: '70%', y: '78%', priority: 1, cooldown: 5000, backswing: 450, enabled: true },
    { name: '技能2', x: '76%', y: '78%', priority: 2, cooldown: 8000, backswing: 500, enabled: true },
    { name: '技能3', x: '82%', y: '78%', priority: 3, cooldown: 12000, backswing: 550, enabled: true },
    { name: '技能4', x: '70%', y: '88%', priority: 4, cooldown: 15000, backswing: 650, enabled: true },
    { name: '技能5', x: '76%', y: '88%', priority: 5, cooldown: 20000, backswing: 700, enabled: true },
    { name: '技能6', x: '82%', y: '88%', priority: 6, cooldown: 25000, backswing: 750, enabled: true },
    { name: '技能7', x: '88%', y: '88%', priority: 7, cooldown: 30000, backswing: 800, enabled: true },
  ],

  normalAttack: {
    interval: 350,
    backswing: 180,
  },

  // 血量条检测
  hpBar: {
    enabled: true,
    left: '20%',
    right: '45%',
    y: '6%',
    fillColor: 0xd94b4b,
    tolerance: 26,
    lowThreshold: 0.3,
    criticalThreshold: 0.15,
  },

  // 体力条检测
  spBar: {
    enabled: true,
    left: '20%',
    right: '45%',
    y: '8.5%',
    fillColor: 0x3aa6ff,
    tolerance: 26,
    lowThreshold: 0.25,
  },
};

const state = {
  lastSkillAt: {},
  lastNormalAttackAt: 0,
  lastHpPotionAt: 0,
  lastSpPotionAt: 0,
};

function now() {
  return Date.now();
}

function clamp(num, min, max) {
  return Math.max(min, Math.min(max, num));
}

function colorDistance(c1, c2) {
  const r1 = (c1 >> 16) & 0xff;
  const g1 = (c1 >> 8) & 0xff;
  const b1 = c1 & 0xff;

  const r2 = (c2 >> 16) & 0xff;
  const g2 = (c2 >> 8) & 0xff;
  const b2 = c2 & 0xff;

  return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
}

async function clickButton(button, duration = 80) {
  await zdjl.clickAsync(button.x, button.y, duration);
}

async function useHpPotion() {
  await clickButton(config.hpPotionButton);
  state.lastHpPotionAt = now();
  await zdjl.sleepAsync(config.potionBackswing);
}

async function useSpPotion() {
  await clickButton(config.spPotionButton);
  state.lastSpPotionAt = now();
  await zdjl.sleepAsync(config.potionBackswing);
}

async function castSkill(skill) {
  await clickButton(skill);
  state.lastSkillAt[skill.name] = now();
  await zdjl.sleepAsync(skill.backswing);
}

async function normalAttack() {
  await clickButton(config.normalAttackButton);
  state.lastNormalAttackAt = now();
  await zdjl.sleepAsync(config.normalAttack.backswing);
}

function isSkillReady(skill) {
  const last = state.lastSkillAt[skill.name] || 0;
  return now() - last >= skill.cooldown;
}

async function getBarRatio(barConfig) {
  if (!barConfig.enabled) {
    return 1;
  }

  // 从右向左扫描状态条，找到最后一个接近填充色的位置。
  const sampleCount = 20;
  let lastFilledIndex = -1;

  for (let i = sampleCount; i >= 0; i -= 1) {
    const x = `${Number.parseFloat(barConfig.left) + (Number.parseFloat(barConfig.right) - Number.parseFloat(barConfig.left)) * (i / sampleCount)}%`;
    const color = await zdjl.getScreenColorAsync(x, barConfig.y, true);
    if (colorDistance(color, barConfig.fillColor) <= barConfig.tolerance) {
      lastFilledIndex = i;
      break;
    }
  }

  if (lastFilledIndex < 0) {
    return 0;
  }

  return clamp(lastFilledIndex / sampleCount, 0, 1);
}

async function handlePotionIfNeeded() {
  const hpRatio = await getBarRatio(config.hpBar);
  const spRatio = await getBarRatio(config.spBar);

  if (config.hpBar.enabled && hpRatio <= config.hpBar.criticalThreshold) {
    await useHpPotion();
    return true;
  }

  if (config.hpBar.enabled && hpRatio <= config.hpBar.lowThreshold && now() - state.lastHpPotionAt > 1500) {
    await useHpPotion();
    return true;
  }

  if (config.spBar.enabled && spRatio <= config.spBar.lowThreshold && now() - state.lastSpPotionAt > 1500) {
    await useSpPotion();
    return true;
  }

  return false;
}

function getNextReadySkill() {
  const enabledSkills = config.skills
    .filter((skill) => skill.enabled)
    .sort((a, b) => a.priority - b.priority);

  for (const skill of enabledSkills) {
    if (isSkillReady(skill)) {
      return skill;
    }
  }

  return null;
}

async function main() {
  zdjl.toast('自动攻击脚本已启动', 2000);

  while (true) {
    // 先保命/回体。
    const usedPotion = await handlePotionIfNeeded();
    if (usedPotion) {
      continue;
    }

    // 再按优先级放技能。
    const nextSkill = getNextReadySkill();
    if (nextSkill) {
      await castSkill(nextSkill);
      continue;
    }

    // 没技能就普攻。
    if (now() - state.lastNormalAttackAt >= config.normalAttack.interval) {
      await normalAttack();
      continue;
    }

    await zdjl.sleepAsync(config.loopInterval);
  }
}

main().catch(async (err) => {
  await zdjl.alertAsync(`脚本异常: ${String(err)}`);
});
