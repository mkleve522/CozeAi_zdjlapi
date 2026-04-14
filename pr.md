# 自动精灵 JS API 速查与编写规范

本文档用于帮助用户理解和编写自动精灵 app 内的 JS 脚本，内容以自动精灵官方文档为准，并补充适合直接产出脚本时使用的速查信息。

## 编写规则

- 代码必须基于真实存在的官方 API 编写
- 若需要图片等变量，直接提示用户在自动精灵中配置图片变量；代码里按 `imageVar` 使用，不在脚本中硬编码图片内容
- 注释带 `[Async]` 的函数，异步版本函数名为原函数名后加 `Async`
- `zdjl` 是自动精灵内默认全局变量，无需导入
- 自动精灵当前已明确支持 JS 语言标准到 `ES2020`
- 自动精灵支持 `require(包名)` 加载 npm 包，也支持 `require('http://...')` 和 `require('file:///...')` 加载 CommonJS 模块文件
- 不再将 `Node.js 8.0.0` 作为脚本语法限制依据；若官方文档未明确声明某项运行时能力，按保守方式使用

## API 速查表

### 通用与脚本控制

- `zdjl.sleep(duration)` `[Async]`：等待指定毫秒数
- `zdjl.runAction(action)`：同步执行一个动作对象
- `zdjl.runActionAsync(action)`：异步执行一个动作对象
- `zdjl.check(condition)`：检查运行条件是否成立
- `zdjl.checkAsync(condition)`：异步检查运行条件是否成立
- `__zdjl.reloadEngine()`：重启 JS 引擎，不建议常规使用

### 剪贴板与变量

- `zdjl.getClipboard()`：读取系统剪贴板
- `zdjl.setClipboard(text)`：写入系统剪贴板
- `zdjl.getVar(name, scope?)`：读取变量
- `zdjl.setVar(name, value, scope?)`：设置变量
- `zdjl.deleteVar(name, scope?)`：删除变量
- `zdjl.deleteVarWithConfirm(name, scope?)`：确认后删除变量
- `zdjl.getVars(scope?)`：获取某作用域全部变量
- `zdjl.printVars()`：弹窗展示变量
- `zdjl.clearVars(scopeId?)`：清空变量
- `zdjl.clearVarsWithConfirm(scope)`：确认后清空变量

### 本地存储与文件

- `zdjl.getStorage(key, scope?)`：读取本地存储
- `zdjl.setStorage(key, value, scope?)`：写入本地存储
- `zdjl.removeStorage(key, scope?)`：删除本地存储
- `zdjl.writeFile(path, content)` `[Async]`：写文件
- `zdjl.writeFileAsync(path, content)`：异步写文件
- `zdjl.appendFile(path, content)` `[Async]`：追加文件
- `zdjl.appendFileAsync(path, content)`：异步追加文件
- `zdjl.readFile(path, options?)`：读取文件
- `zdjl.readFileAsync(path, options?)`：异步读取文件

### 网络请求

- `zdjl.requestUrl(config)` `[Async]`：发起 HTTP 请求
- `zdjl.requestUrlAsync(config)`：异步发起 HTTP 请求

### 点击、滑动与手势

- `zdjl.click(x, y, duration?)` `[Async]`
- `zdjl.longClick(x, y)` `[Async]`
- `zdjl.swipe(x1, y1, x2, y2, duration?)` `[Async]`
- `zdjl.gesture(duration, ...points)` `[Async]`
- `zdjl.gestures(...gestureConfigs)` `[Async]`
- `zdjl.touchDown(x, y)` `[Async]`
- `zdjl.touchMove(x, y, duration?)` `[Async]`
- `zdjl.touchUp()` `[Async]`

### 键盘输入

- `zdjl.keyDown(key)`：按下按键
- `zdjl.keyUp(key)`：抬起按键
- `zdjl.keyPress(...keysAndDuration)`：按组合键并在指定时间后抬起

### 节点、找图、找字、OCR

- `zdjl.findNode(posData, config)` `[Async]`：查找节点
- `zdjl.findLocation(posData, findAll)` `[Async]`：找图、找字、找色
- `zdjl.recognitionScreen(config)` `[Async]`：OCR 识别或截图
- `zdjl.ocr(config)` `[Async]`：直接识别 base64 图片内容
- 文字识别性能开销较高，需谨慎使用

### 弹窗与用户交互

- `zdjl.toast(message, duration?)`
- `zdjl.alert(message, options?)` `[Async]`
- `zdjl.confirm(message, options?)` `[Async]`
- `zdjl.prompt(message, defaultValue?, options?)` `[Async]`
- `zdjl.select(config)` `[Async]`

### 屏幕与设备能力

- `zdjl.getScreenColor(x, y, ignoreCache?)` `[Async]`
- `zdjl.getScreenAreaColors(param)` `[Async]`
- `zdjl.getAppVersion()`
- `zdjl.getUser()`
- `zdjl.getDeviceInfo()`
- `zdjl.getLocation(param?)` `[Async]`
- `zdjl.setScreenBrightness(value)`
- `zdjl.setWifiEnable(enable)`
- `zdjl.setBluetoothEnable(enable)`
- `zdjl.setCameraFlashEnable(enable)`
- `zdjl.getInstalledAppInfo()`
- `zdjl.getMousePosition()`
- `zdjl.vibrator(duration?, amplitude?)`
- `zdjl.wakeupScreen()`

### 多媒体

- `zdjl.playMedia(url)` `[Async]`：播放音频
- `zdjl.playMediaAsync(url)`：异步播放音频

## 常用参数类型

- `px`：支持数字像素、`dp` 逻辑像素、百分比字符串，如 `100`、`'20dp'`、`'50%'`
- `ms`：毫秒数
- `area`：矩形区域 `{ left, top, right, bottom }`
- `imageVar`：由用户在自动精灵中配置的图片变量
- `LocationResult`：坐标查找结果，包含 `x`、`y`、`x_100`、`y_100`、`x_dp`、`y_dp`

## 完整类型声明

```ts
type str = string
type num = number
type num0_255 = number
type num_100_100 = number // -100~100
type num_255_255 = number // -255~255
type numPrec = number
type px = num | `${num}dp` | `${num}%`
type ms = num

interface area { left: px; top: px; right: px; bottom: px }
type color = `#${str}`
type indexNum = num | `${num}` | `${num},${num}` | ...

interface LocationResult {
  x: num
  y: num
  x_100: num
  y_100: num
  x_dp: num
  y_dp: num
}

interface imageVar {
  data: str
  imageWidth: num
  imageHeight: num
  imageLeft: num
  imageTop: num
  screenWidth: num
  screenHeight: num
}

declare interface zdjl {
  sleep(duration: ms) //[Async]
  runAction(action: any)
  runActionAsync(action: any)
  check(condition: any): boolean

  getClipboard(): str
  setClipboard(text: str): void

  getVar(varName: str, scope?: 'global' | str): any
  setVar(varName: str, varValue: any, scope?: 'global' | str): void
  deleteVar(varName: str, scope?: 'global' | str): void
  deleteVarWithConfirm(varName: str, scope?: 'global' | str): void
  getVars(scope?: 'global' | str): Record<str, any>
  printVars(): void
  clearVars(scopeId?: str): void
  clearVarsWithConfirm(scope: str): void

  getStorage(storageKey: str, scope?: str): any
  setStorage(storageKey: str, content: any, scope?: str): void
  removeStorage(storageKey: str, scope?: str): void

  requestUrl(config: {
    url: str
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    headers?: { [key: str]: str }[]
    requestBody?: str
    requestType?: str
    responseType?: str
    timeout?: num
  }): {
    code: num
    body: str
    headers: Record<str, str | str[]>
  } //[Async]

  click(x: px, y: px, duration?: num): void //[Async]
  longClick(x: px, y: px): void //[Async]
  swipe(x1: px, y1: px, x2: px, y2: px, duration?: ms): void //[Async]
  gesture(duration: ms, ...xyArray: Array<[px, px]>): void //[Async]
  gestures(...gestureConfigs: Array<[num, ...Array<[px, px]>] | [num, num, ...Array<[px, px]>]>): void //[Async]
  touchDown(x: px, y: px): void //[Async]
  touchMove(x: px, y: px, duration?: ms): void //[Async]
  touchUp(): void //[Async]
  keyDown(key: str): void
  keyUp(key: str): void
  keyPress(...keysAndDuration: Array<str | ms>): void
}

declare interface FindNodeResult {
  text: str
  className: str
  idResName: str
  packageName: str
  boundLeft: num
  boundTop: num
  boundRight: num
  boundBottom: num
  children?: FindNodeResult[]
}

declare interface zdjl {
  findNode<FindAll extends boolean>(
    posData: any,
    config: { findAll?: FindAll; withChildren?: boolean }
  ): (FindAll extends true ? FindNodeResult[] : FindNodeResult) //[Async]

  writeFile(filePath: str, fileContent: str | ArrayBuffer | Uint8Array): void //[Async]
  appendFile(filePath: str, fileContent: str | ArrayBuffer | Uint8Array): void //[Async]
  readFile(filePath: str, options?: {
    encode?: 'UTF-8' | 'GBK' | 'BASE64'
    returnBuffer?: boolean
  }): str | ArrayBuffer

  ocr(config: {
    mode: 'local' | 'online' | 'local_comp'
    base64: str
    charWhiteList?: str
    resultType?: 'text' | 'raw'
  }): str | Array<textRawItem> //[Async]
}

type PositionFind = findImage | findText | findColor

interface findImage {
  type: 'image'
  imageData: imageVar
  limitArea?: `${px} ${px} ${px} ${px}` | area
  minSimilarPercent?: num
  indexNum?: indexNum
  quickSearch?: boolean
  searchMode?: 'color_2.21' | 'outline_2.21' | 'COLOR' | 'HOG'
  imageFilter?: filter
  imageScaleType?: 'dpi' | 'baseScreenWidth' | 'baseScreenHeight' | 'baseScreenWidthAndHeight' | 'tryAll'
  xOffset?: num
  yOffset?: num
}

interface findColor {
  type: 'color'
  color: color
  limitPosX?: px
  limitPosY?: px
  limitArea?: `${px} ${px} ${px} ${px}` | area
  similarPercent?: num
  xOffset?: px
  yOffset?: px
}

interface findText {
  type: 'text'
  text: string
  ocrMode?: 'local' | 'local_v2' | 'online'
  limitArea?: `${px} ${px} ${px} ${px}` | area
  filter?: filter
  indexNum?: indexNum
  xOffset?: px
  yOffset?: px
}

declare interface zdjl {
  findLocation(posData: PositionFind, findAll: boolean): (typeof findAll extends true ? LocationResult[] : LocationResult) //[Async]

  toast(message: str, duration?: num): void
  alert(message: str, options?: { duration?: ms; numbertitle?: str }): void //[Async]
  confirm(message: str, options?: { duration?: ms; numbertitle?: str }): boolean //[Async]
  prompt(message: str, defaultValue?: str, options?: { duration?: ms }): str //[Async]
  select<T>(config: {
    title?: str
    items: str[]
    selectItems?: str[]
    multi?: false
    duration?: num
  }): { result: num | num[]; items: str[] }

  getScreenColor(x: px, y: px, ignoreCache?: boolean): num //[Async]
  getScreenAreaColors(param: {
    x: px
    y: px
    width: px
    height: px
    ignoreCache?: boolean
    sample?: num
  }): { data: num[]; x: num; y: num; width: num; height: num }

  getAppVersion(): str
  getUser(): { userId: str; userName: str; isVip: boolean }
  getDeviceInfo(): {
    appVersion: str
    appVersionCode: num
    deviceId: str
    userAgent: str
    screenRotation: num
    screenWidth: num
    screenHeight: num
    width: num
    height: num
    density: num
    densityDpi: num
    clientType: 'android' | 'pc'
  }

  getLocation(param?: { timeout?: ms }): object //[Async]
  setScreenBrightness(value: num): str
  setWifiEnable(enable: boolean): void
  setBluetoothEnable(enable: boolean): void
  setCameraFlashEnable(enable: boolean): void
  getInstalledAppInfo(): Array<{
    isSystemApp: boolean
    packageName: str
    versionCode: num
    versionName: str
    label: str
  }>
  getMousePosition(): { x: num; y: num; xInScreen: num; yInScreen: num }
  playMedia(url: string): void //[Async]
  vibrator(duration?: ms, amplitude?: num): void
  wakeupScreen(): void
}

declare interface __zdjl {
  reloadEngine(): void
}

interface textRawItem {
  text: str
  left: num
  top: num
  right: num
  bottom: num
}

interface image {
  data: str
  width: num
  height: num
  scale: num
}

declare interface zdjl {
  recognitionScreen(config: {
    recognitionArea: `${px} ${px} ${px} ${px}` | area
    ocrResultType?: 'text' | 'raw'
    recognitionMode?: 'ocr_local' | 'ocr_local_comp' | 'ocr_online'
    imageFilter?: filter
  }): string | Array<textRawItem>

  recognitionScreen(config: {
    recognitionArea: `${px} ${px} ${px} ${px}` | area
    ocrResultType: 'raw'
    recognitionMode: 'get_image_data'
    imageFilter?: filter
  }): { data: str; width: num; height: num; scale: num }
}

type filter = blackWhite | grey | outline | reverse | lightness | contrast | rgb | changeColor | multi

interface blackWhite { type: 'bw'; threshold?: num0_255; greyAlgorithm?: 'average' | 'max' }
interface grey { type: 'grey'; threshold?: num0_255; greyAlgorithm?: 'average' | 'max' }
interface outline { type: 'outline'; threshold: numPrec }
interface reverse { type: 'reverse' }
interface lightness { type: 'lightness'; change: num_100_100 }
interface contrast { type: 'contrast'; change: num_100_100 }

interface rgb {
  type: 'rgb'
  changeRed: num_100_100
  changeGreen: num_100_100
  changeBlue: num_100_100
}

interface changeColor {
  type: 'changeColor'
  changeColorRules: Array<{
    similarPercent: numPrec
    srcColor: num
    destColor: num
  }>
  otherColorChangeTo: num
}

interface multi {
  filters: Array<filter>
}
```
