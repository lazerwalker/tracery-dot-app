import { app, Menu, MenuItem, ipcMain } from 'electron';
import { enableLiveReload } from 'electron-compile';

import createWindow, { windows } from './createWindow';
import * as fileIO from './fileIO';

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

app.on('open-file', async (sender: any, filepath: string) => {
  // TODO: This code copy/pasted from createWindow's options object
  const file = await fileIO.openFile(filepath);
  const window = await createWindow();
  ipcMain.once('ready', () => {
    window.webContents.send('open', file);
  });
});

ipcMain.on('save', async (_: any, file: fileIO.TraceryFile) => {
  console.log('Received save', file.data);
  await fileIO.save(file);
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
