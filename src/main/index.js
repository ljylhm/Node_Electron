import { app, BrowserWindow, ipcMain } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    useContentSize: true,
    minWidth: 600,
    minHeight: 400,
    width: 800
  })

  mainWindow.loadURL(winURL)

  // 下载的事件 下载过程中发生的事件
  mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
    // 设置保存路径,使Electron不提示保存对话框。
    let savePath = 'C:/User/94802/Desktop/gzip/'.replace(/\//g, "\\");
    // item.setSavePath(savePath + item.getFilename());
    mainWindow.webContents.send('begin-download');
    // 下载过程中的事件 state代表当前
    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
     
      } else if (state === 'progressing') {
        if (item.isPaused()) {
        } else {
          mainWindow.webContents.send('received-bytes', item.getReceivedBytes());
        }
      }
    })

    item.once('done', (event, state) => {
      console.log("state",state);
      if (state === 'completed') {
        for(var i in item){
          console.log(i);
        }
        
        mainWindow.webContents.send('success-download', item.getFilename()+","+item.getURL()+","+item.getSavePath());
      } else {
        console.log(`Download failed: ${state}`)
      }
    })

  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // 在beforeClose 之前执行
  mainWindow.on('close', () => {
    mainWindow.webContents.send('close-window');
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on("download", (event, filePath) => {
  mainWindow.webContents.downloadURL(filePath);
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
