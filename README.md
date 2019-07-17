# husky

> electron png jpg gif

#### 前言
 最近在捣鼓electron，因为使用vue已经有一段时间了，所以使用了vue-electron来当做我的主要框架。（应该不能算框架，可以算个库吧，集合webpack把我们吧开发环境搭建好，后期的打包也做了封装，总的来说用起来感觉很不错）。
 #### 结构图
 ![Image text](https://file.40017.cn/huochepiao/activity/20180918test/结构目录图.png?180918190849)
 #### 路由结构图
  路由结构花了蛮长时间弄的，主要是想把导入路由变得简单，现在我们使用的方法无论怎样都是要去route.js里面导入相对应的vue;在webpack环境中利用require.context来遍历布局的vue文件夹，并通过定义的规则和使用递归来处理层级路由的关系。
 ![Image text](https://file.40017.cn/huochepiao/activity/20180920test/路由分析图.png)
#### 预览图片
  首页展示</br>
 ![Image text](http://file.40017.cn/huochepiao/activity/MyPic/index.png)
  压缩图片
  
 ![Image text](http://file.40017.cn/huochepiao/activity/MyPic/gzip.png)
  获得七牛云</br>
 ![Image text](http://file.40017.cn/huochepiao/activity/MyPic/load.png) 
  下载列表</br>
 ![Image text](http://file.40017.cn/huochepiao/activity/MyPic/picupload.png) 
 
 
 
 
 ## Electron

### 起步

**Elecrton**是由Github开发，用HTML，CSS和JavaScript来构建跨平台桌面应用程序的一个开源库。 Electron通过将**Chromium**和**Node.js**合并到同一个运行时环境中，并将其打包为Mac，Windows和Linux系统下的应用来实现这一目的

##### 更新

**Electron**中**Chromium**的版本通常会在**Chromium**发行新的稳定版后的一到两周之内更新，具体时间根据升级所需的工作量而定。为了使版本更加稳定，Electron通常会在Node.js发布了新版本的一个月之后再更新。在Electron里，Node.js和Chromium共享同一个V8实例--通常是Chromium在用的版本。大多数情况下这能*正常工作*但有时候还是需要为Node.js打补丁。



#### 应用结构

##### 主进程和渲染进程

Javascript虽然是**单线程**,但是我们可以分发进程

> Electron 运行 `package.json` 的 `main` 脚本的进程被称为**主进程**。 在主进程中运行的脚本通过创建web页面来展示用户界面。 一个 Electron 应用总是有且只有一个主进程。
>
> 由于 Electron 使用了 Chromium 来展示 web 页面，所以 Chromium 的多进程架构也被使用到。 每个 Electron 中的 web 页面运行在它自己的**渲染进程**中。

**我们平时写JS的语言,因为安全而拘泥于浏览器的沙盒限制，不能像后端语言操控直接操作文件,但是在Electron中，完全可以不用考虑这些了，我们可以开心的在一个类浏览器的环境里面使用NodeJs了。**

> 在普通的浏览器中，web页面通常在沙盒环境中运行，并且无法访问操作系统的原生资源。 然而 Electron 的用户在 Node.js 的 API 支持下可以在页面中和操作系统进行一些底层交互。



![Image text](https://camo.githubusercontent.com/4360fec65bba1cec27c4472f5df2aadfa8f33a24/68747470733a2f2f66696c652e34303031372e636e2f68756f6368657069616f2f61637469766974792f3230313830393138746573742f2545372542422539332545362539452538342545372539422541452545352542442539352545352539422542452e706e673f313830393138313930383439)

对于**Electron**来说，依然采用了**Chromium** 的多进程架构。在浏览器中，每一个**Tab**页其实对应的就是一个进程，**Tab**页面中的页面独立的运行在自己的进程中。与浏览器类似，**Electron**也可以同时打开几个页面，相应的，每一个页面对应就是一个**渲染进程**。



#####主进程**和**渲染进程区别

1. 一个 **Electron** 应用总是有且只有一个主进程，而渲染进程可以有很多个。
2. 主进程控制整个应用的生命周期，渲染进程只关注自己的渲染。

> 主进程使用 `BrowserWindow` 实例创建页面。 每个 `BrowserWindow` 实例都在自己的渲染进程里运行页面。 当一个 `BrowserWindow` 实例被销毁后，相应的渲染进程也会被终止。



##### 主进程和渲染进程的通讯

因为主进程和渲染进程是相互独立的，所以进程之间通讯的话需要通过**Electron**提供的API来实现。

**ipcMain**  **ipcRender**  **remote**

> ipcMain,ipcRender模块是EventEmitter类的一个实例。 当在主进程中使用时，它处理从渲染器进程（网页）发送出来的异步和同步信息。 从渲染器进程发送的消息将被发送到该模块

```javascript
// 在主进程中.
const { ipcMain } = require('electron')
ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.reply('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.returnValue = 'pong'
})
```

```javascript
//在渲染器进程 (网页) 中。
const { ipcRenderer } = require('electron')
console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg) // prints "pong"
})
ipcRenderer.send('asynchronous-message', 'ping')
```



**remote**

在上面，我们通过**ipcMain**和**ipcRender**来进行进程间的通信，但**Electron**也提供了一种更简洁的方法**remote**可以在渲染进程中直接访问主进程的方法。

> 在Electron中, GUI 相关的模块 (如 `dialog`、`menu` 等) 仅在主进程中可用, 在渲染进程中不可用。 为了在渲染进程中使用它们, `ipc` 模块是向主进程发送进程间消息所必需的。 使用 `remote` 模块, 你可以调用 main 进程对象的方法, 而不必显式发送进程间消息。

在渲染进程中调用主进程中的方法从而新开一个窗口

```javascript
const { BrowserWindow } = require('electron').remote
let win = new BrowserWindow({ width: 800, height: 600 })
win.loadURL('https://github.com')
```

注意，remote其实是一个远程对象，我们可以把它当做远程操控，我们在渲染进程利用remote创建的每一个远程对象和方法其实在渲染进程中都没有创建，而是由remote在主进程中创建的，并且在渲染进程中返回相应的远程对象。

> Electron 确保只要渲染进程中的远程对象一直存在（换句话说，没有被回收），主进程中的相应对象就不会被释放。 当远程对象被垃圾回收后，主进程中的相应对象将被解除引用。

> 如果远程对象在渲染进程中泄露（例如存储在映射中，但从未释放），则主进程中的相应对象也将被泄漏，所以您应该非常小心，不要泄漏远程对象。



常用的一些**Electron**内置模块

![Image text](http://ww1.sinaimg.cn/large/006tNc79gy1g50ig6saxqj307d0i0t9d.jpg)



![Image text](http://ww3.sinaimg.cn/large/006tNc79gy1g50ihym095j305n04edfv.jpg)

![Image text](http://ww2.sinaimg.cn/large/006tNc79gy1g50ij90a62j306p04kgln.jpg)

![Image text](http://ww2.sinaimg.cn/large/006tNc79gy1g50inip8r0j30960kdabp.jpg)



####Demo示例 开始一个Electron项目

我们可以把一个渲染进程当做一个页面，个人感觉**Electron**中使用单页应用效果非常好。

在渲染进程中我们可以结合React,Vue等框架，也可以使用你想要的UI框架



##### 利用**webpack**搭建一个开发环境

因为在开发环境中我们要使用热重载来使代码更新，所以结合需要起一个服务，这里我们使用webpack-dev-server这个集成的插件

NodeJs中的**spwan**模块，来自于**child_process**    这个模块可以分发一个子进程，你也可以使用**execSync**这些对spwan模块进一步封装的模块。

```javascript
  devServer:{
        host: "localhost",
        port: PORT,
        inline: true,
        open: false,
        compress: true, // 打包的内容进行压缩
        hot: true,
        before(){
            // render进程启动前 分发主进程
            console.log("---- Start Main Process ----")
            spawn('npm', ['run', 'dev:main'], {
                shell: true,
                env: process.env,
                stdio: 'inherit'
            })
            .on('close', code => process.exit(code))
            .on('error', spawnError => console.error(spawnError));
        }
    }
```

执行spawn会执行一段shell命令

Package.json

```javascript
{
  "name": "startapp",
  "version": "0.0.1",
  "description": "electron start app",
  "main": "./main/app.js",
  "scripts": {
    "dev": "webpack-dev-server --mode development --config ./config/webpack.config.render.js",
    "dev:main": "electron ."
  },
  "keywords": [
    "electron",
    "app",
    "start"
  ],
  "author": "ljy",
  "license": "ISC",
  "dependencies": {
    "electron": "^5.0.6",
    "ts-loader": "^6.0.4",
    "typescript": "^3.5.3",
    "webpack": "^4.35.3",
    "webpack-cli": "^3.3.5",
    "webpack-dev-server": "^3.7.2"
  }
}
```

App.js

```javascript
app.on('ready',()=>{

    mainWindow = new BrowserWindow({
        show: true,
        width: 1024,
        height: 728
    });

    console.log("app ready 完毕")

    // 将页面加载load进来
    const winURL = `http://localhost:3003/render/index.html`
    // http://localhost:9080
    mainWindow.loadURL(winURL);
    mainWindow.loadFile(WinURL)

    mainWindow.on('closed', () => {
      mainWindow = null;
    });

})  
```



##### 关于打包

**electron-builder**

使用**electron-builder**打包的方式其实很简单，直接在package.json写配置文件即可

```javascript
"build":{
    "productName":"startApp",     // 项目名 这也是生成的exe或者app文件的前缀名
    "appId":"com.leon.startApp",  // 包名 
    "directories": {              // 打包后的目录
      "output": "build"
    },
    "files": [                    // 需要打包的文件
      "render/**/*",
      "main/**/*"
    ],
    "dmg": {                      // 生成的dmg的配置文件
      "contents": [
        {
          "x": 410,
          "y": 150,
          "type": "link",
          "path": "/Applications"
        },
        {
          "x": 130,
          "y": 150,
          "type": "file"
        }
      ]
    },
    "mac": {
      "icon": "build/icons/icon.icns"    // 生成的图标icon
    }
```



然后直接在命令行运行**electron-builder -m**的命令打包成mac的黄环境




