import { Menu, app, shell, MenuItem, BrowserWindow, MenuItemConstructorOptions } from 'electron';

export default () => {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            const mainWindow = new BrowserWindow({
              width: 800,
              height: 600,
            });

            // and load the index.html of the app.
            mainWindow.loadURL(`file://${__dirname}/index.html`);
          }
        },
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            console.log('OPEN');
          }
        },
        {
          role: 'recentDocuments'
        },
        {
          type: 'separator'
        },
        {
          role: 'close'
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => console.log('Save')
        },
        {
          label: 'Duplicate',
          accelerator: 'ShiftCmdOrCtrl+S',
          click: () => console.log('Duplicate')
        },
        {
          label: 'Rename...',
          click: () => console.log('Rename')
        },
        {
          label: 'Move To...',
          click: () => console.log('Move to...')
        },
        {
          label: 'Revert To',
          click: () => console.log('Revert')
        },
        {
          type: 'separator'
        },
        {
          label: 'Share',
          click: () => console.log('Share')
        },
        {
          label: 'Export',
          click: () => console.log('Export')
        },
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          role: 'undo'
        },
        {
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          role: 'cut'
        },
        {
          role: 'copy'
        },
        {
          role: 'paste'
        },
        {
          role: 'pasteandmatchstyle'
        },
        {
          role: 'delete'
        },
        {
          role: 'selectall'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click(_: MenuItem, focusedWindow: BrowserWindow) {
            if (focusedWindow) { focusedWindow.reload(); }
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click(_: MenuItem, focusedWindow: BrowserWindow) {
            if (focusedWindow) { focusedWindow.webContents.toggleDevTools(); }
          }
        },
        {
          type: 'separator'
        },
        {
          role: 'resetzoom'
        },
        {
          role: 'zoomin'
        },
        {
          role: 'zoomout'
        },
        {
          type: 'separator'
        },
        {
          role: 'togglefullscreen'
        }
      ]
    },
    {
      role: 'window',
      submenu: [
        {
          role: 'minimize'
        },
        {
          role: 'close'
        }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click() { shell.openExternal('http://electron.atom.io'); }
        }
      ]
    }
  ];

  if (process.platform === 'darwin') {
    const name = app.getName() || 'Tracery';
    const submenu = {
      label: name,
      submenu: [
        {
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          role: 'hide'
        },
        {
          role: 'hideothers'
        },
        {
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          role: 'quit'
        }
      ]
    };
    template.unshift(submenu);

    // Window menu.
    // template[2].submenu = [
    //   {
    //     label: 'Close',
    //     accelerator: 'CmdOrCtrl+W',
    //     role: 'close'
    //   },
    //   {
    //     label: 'Minimize',
    //     accelerator: 'CmdOrCtrl+M',
    //     role: 'minimize'
    //   },
    //   {
    //     label: 'Zoom',
    //     role: 'zoom'
    //   },
    //   {
    //     type: 'separator'
    //   },
    //   {
    //     label: 'Bring All to Front',
    //     role: 'front'
    //   }
    // ];
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};