const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Notification, ipcMain, Tray, Menu} = electron;

let mainWindow;
let tray = null

//app.dock.hide();

function createWindow(){
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        show: false,
        frame: false,
        fullscreenable: false,
        resizable: false,
        width: 320,
        height: 350,
        transparent: true,
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol:'file:',
        slashes: true
    }));
    mainWindow.on('blur', () => {
        if (!mainWindow.webContents.isDevToolsOpened()) {
            mainWindow.hide();
        }
    });
}
const getWindowPosition = () => {
    const windowBounds = mainWindow.getBounds();
    const trayBounds = tray.getBounds();
    
    const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))

    const y = Math.round(trayBounds.y + trayBounds.height - 400)
    return {x: x, y: y}
}
const showWindow = () => {
    const position = getWindowPosition();
    mainWindow.setPosition(position.x, position.y, false);
    mainWindow.show();
}
const toggleWindow = () => {
    mainWindow.isVisible() ? mainWindow.hide() : showWindow();
}
const createTray = () => {
    tray = new Tray(path.join('icon.png'));
    tray.on('click', function (event) {
        toggleWindow();
    })
}
// Listen
app.on('ready', function(){
    createTray();
    createWindow();
});

const Lookup = require("node-yeelight-wifi").Lookup;

let look = new Lookup();

look.on("detected",(light) =>
{
    console.log("new yeelight detected: id="+light.id + " name="+light.name);

    ipcMain.on('req:bright', function(event){
        //event.reply('bright', light.bright)
        mainWindow.webContents.send('bright', light.bright);
    }) 
    ipcMain.on('bright:lvl', function(event, lvl){
        
        console.log('brght ' + lvl)

        light.setBright(Number(lvl)).then(() =>
        {
            console.log("success");
        }).catch((error =>
        {
            console.log("failed",error);
        }));

    })

    ipcMain.on('switch', function(event){ 

        light.setPower(!light.power).then(() =>
        {
            console.log("success");
        }).catch((error =>
        {
            console.log("failed",error);
        }));

    })
});



    




