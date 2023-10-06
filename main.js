//const { ipcRenderer, remote, app, BrowserWindow } = require('electron');
//const path = require('path')
//let win;


"use strict";
Object.defineProperty(exports, "__esModule", { value: true });//new ligne
var electron_1 = require("electron");//new ligne
var path = require("path");
var fs = require("fs");//new ligne
var url = require("url");//new ligne
// Initialize remote module
require('@electron/remote/main').initialize();//new ligne

var win = null;
var args = process.argv.slice(1), serve = args.some(function (val) { return val === '--serve'; });//new ligne



function createWindow() {
  var electronScreen = electron_1.screen;//new ligne
  var size = electronScreen.getPrimaryDisplay().workAreaSize;//new ligne

win = new electron_1.BrowserWindow({

  //x: 0,  //new ligne
  //y: 0,  //new ligne
  frame: true, //Affichage des bouttons
  transparent: true,
  //width: size.width/2,  //new ligne
  //height: size.height/2,  //new ligne
  resizable: true,
  minimizable: true,
  webPreferences: {
    nodeIntegration: true,
    allowRunningInsecureContent: (serve) ? true : false, //new ligne
    contextIsolation: false,
    enableRemoteModule: true,
    //preload: path.join(__dirname, 'preload.js')
  }

});
  
win.setMenuBarVisibility(false);//Affichage du Menu
  //win.loadFile('src/index.html');

  if (process.env.DEBUG) {
    win.webContents.openDevTools(); //Affichage du débogage
    win.loadURL(`http://localhost:4200`);
  } else {
    win.loadURL(`file://${__dirname}/dist/integrate-angular/index.html`)
  }

  /*--------------Les lignes ci-dessous gère le projet appeler suivant l'envirenement----------------*/
  /*if (serve) {
      win.webContents.openDevTools();
      require('electron-reload')(__dirname, {
          electron: require(path.join(__dirname, '/../node_modules/electron'))
      });
      win.loadURL('http://localhost:4200');
  }
  else {
      // Path when running electron executable
      var pathIndex = './src/index.html';
      if (fs.existsSync(path.join(__dirname, './dist/integrate-angular/index.html'))) {
          // Path when running electron in local folder
          pathIndex = './dist/integrate-angular/index.html';
      }
      win.loadURL(url.format({
          pathname: path.join(__dirname, pathIndex),
          protocol: 'file:',
          slashes: true
      }));
  }/*FIN DE REDIRECTION*/

  win.on('closed', () => {
      win = null;
  });

  return win;

}
try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  electron_1.app.on('ready', function () { return setTimeout(createWindow, 400); });
  // Quit when all windows are closed.
  electron_1.app.on('window-all-closed', function () {
      // On OS X it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== 'darwin') {
          electron_1.app.quit();
      }
  });
  electron_1.app.on('activate', function () {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (win === null) {
          createWindow();
      }
  });
}
catch (e) {
  // Catch Error
  // throw e;
}
