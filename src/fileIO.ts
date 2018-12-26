import { dialog, app } from 'electron';

import * as fs from 'fs';

export async function save(file: TraceryFile): Promise<TraceryFile> {
  console.log('SAVING FILE', file.filepath, file.data);
  return new Promise((resolve, reject) => {
    console.log('In promise');
    fs.writeFile(file.filepath, file.data, 'utf8', (err) => {
      if (err) {
        reject('An error ocurred reading the file :' + err.message);
        return;
      }

      console.log('Finished saving');

      resolve(file);
    });
  });
}

export interface TraceryFile {
  filepath: string;
  data: string;
}

// TODO: What if it's not a text file?
export async function openFileMenu(): Promise<TraceryFile> {
  return new Promise((_, reject) => {
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
      return openFile(filepath);
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
