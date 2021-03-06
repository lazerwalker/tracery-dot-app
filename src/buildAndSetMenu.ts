import { Menu, app, shell, MenuItem, BrowserWindow, Accelerator } from 'electron';

import * as fileIO from './fileIO';
import { MenuOptions } from './createWindow';

export default (options: MenuOptions, window: BrowserWindow) => {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            options.newDocument();
          }
        },
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const data = await fileIO.openFileMenu();
            options.open(data, window);
          }
        },
        {
          role: 'recentDocuments',
          submenu: []
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
          click: () => options.save(window)
        }
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
        },
        {
          type: 'separator'
        },
        {
          label: 'Refresh Results',
          accelerator: 'CmdOrCtrl+R',
          click: () => options.refreshResults(window)
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Word Wrap',
          accelerator: 'Alt+Z',
          click: () => { options.toggleWordWrap(window); }
        },
        {
          label: 'Toggle Live HTML Rendering',
          click: () => { options.toggleHTMLRendering(window); }
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
          click() { shell.openExternal('https://github.com/lazerwalker/tracery-dot-app'); }
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