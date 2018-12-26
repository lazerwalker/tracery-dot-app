import { app, BrowserWindow, Menu, MenuItem } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';
import * as _ from 'lodash';

import buildAndSetMenu from './buildAndSetMenu';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let windows: Electron.BrowserWindow[] = [];

const menu = new Menu();

menu.append(new MenuItem({
  label: 'Print',
  accelerator: 'CmdOrCtrl+P',
  click: () => { console.log('time to print stuff'); }
}));

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) {
  enableLiveReload({ strategy: 'react-hmr' });
}

const createWindow = async () => {
  // Create the browser window.
  let window = new BrowserWindow({
    width: 800,
    height: 600,
  });

  windows.push(window);

  // and load the index.html of the app.
  window.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    window.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  window.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    windows = _.without(windows, window);
  });

  buildAndSetMenu(window);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (windows.length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
