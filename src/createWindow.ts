import { BrowserWindow } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import * as _ from 'lodash';

import buildAndSetMenu from './buildAndSetMenu';
import { TraceryFile } from './fileIO';

const isDevMode = process.execPath.match(/[\\/]electron/);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
export let windows: Electron.BrowserWindow[] = [];

export interface MenuOptions {
  newDocument: () => void;
  open: (file: TraceryFile) => void;
  save: (file: TraceryFile) => void;
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

  const options: MenuOptions = {
    newDocument: createWindow,
    open: (file) => { window.webContents.send('open', file); },
    save: (file) => { window.webContents.send('save', file); }
  };

  buildAndSetMenu(options);
};

export default createWindow;