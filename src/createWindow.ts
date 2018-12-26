import { BrowserWindow, ipcMain } from 'electron';
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
  open: (file: TraceryFile, window?: BrowserWindow) => void;
  save: (window: BrowserWindow) => void;
  toggleWordWrap: (window: BrowserWindow) => void;
  toggleHTMLRendering: (window: BrowserWindow) => void;
  refreshResults: (window: BrowserWindow) => void;
}

const createWindow = async (): Promise<BrowserWindow> => {
  return new Promise(async (resolve, reject) => {
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

    buildAndSetMenu(options, window);

    resolve(window);
  });
};

const options: MenuOptions = {
  newDocument: createWindow,
  open: (file, window) => {
    if (_.includes(windows, window)) {
      window!.webContents.send('open', file);
    } else {
      createWindow().then(w => {
        ipcMain.once('ready', () => {
          w.webContents.send('open', file);
        });
      }).catch(e => console.log(e));
    }
  },
  save: (window) => {
    window.webContents.send('save');
  },
  toggleWordWrap: (window) => {
    window.webContents.send('toggleWordWrap');
  },
  toggleHTMLRendering: (window) => {
    window.webContents.send('toggleHTMLRendering');
  },
  refreshResults: (window) => {
    window.webContents.send('refresh');
  }
};

export default createWindow;