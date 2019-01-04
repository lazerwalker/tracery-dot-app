import { dialog, app } from 'electron';

import * as fs from 'fs';

export async function save(file: TraceryFile): Promise<TraceryFile> {
  return new Promise(async (resolve, reject) => {
    if (file.filepath) {
      fs.writeFile(file.filepath, file.data, 'utf8', (err) => {
        if (err) {
          reject('An error ocurred reading the file :' + err.message);
          return;
        }
        resolve(file);
      });
    } else {
      const filepath = dialog.showSaveDialog({});
      app.addRecentDocument(filepath);

      // Resolving a recursive async function is funny
      resolve(await save({ filepath, data: file.data }));
    }
  });

}

export interface TraceryFile {
  filepath?: string;
  data: string;
}

// TODO: What if it's not a text file?
export async function openFileMenu(): Promise<TraceryFile> {
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
      resolve(openFile(filepath));
    });
  });
}

export async function openFile(filepath: string): Promise<TraceryFile> {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf-8', (err, data) => {
      if (err) {
        reject('An error ocurred reading the file :' + err.message);
        return;
      }

      app.addRecentDocument(filepath);
      resolve({ filepath, data });
    });
  });
}
