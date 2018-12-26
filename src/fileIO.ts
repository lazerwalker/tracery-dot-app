import { dialog } from 'electron';

import * as fs from 'fs';

export function save() {
  console.log('save');
}

interface File {
  filepath: string;
  data: string;
}

// TODO: What if it's not a text file?
export async function open(): Promise<File> {
  return new Promise((resolve, reject) => {
    dialog.showOpenDialog({}, (fileNames) => {
      if (fileNames === undefined) {
        console.log('No file selected');
        reject('No file selected');
      } else if (fileNames.length > 1) {
        console.log('TODO: User selected multiple files!');
        console.log(fileNames);
        reject('User selected multiple files');
      }

      const filepath: string = fileNames[0];

      fs.readFile(filepath, 'utf-8', (err, data) => {
        if (err) {
          reject('An error ocurred reading the file :' + err.message);
          return;
        }

        resolve({ filepath, data });
      });
    });
  });
}
