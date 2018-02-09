/**
 * Created by ljy48594 on 2018/1/19.
 */
/**
* @主程序
*
* */

const electron = require('electron');
const { app } = electron;
const { BrowserWindow } = electron;

var win;

function createWindow() {

    win = new BrowserWindow({width: 800, height: 600,frame: false});
    win.loadURL('file://'+__dirname+'/index.html');

    win.webContents.openDevTools();

    win.on('closed',function () {
        win = null;
    })
}

app.on('ready', createWindow);

app.on('window-all-closed',function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate',function () {
    if (win === null) {
        createWindow();
    }
});
