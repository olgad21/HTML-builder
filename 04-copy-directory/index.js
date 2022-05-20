const path = require('path');
const fs = require('fs/promises');

const newDirPath = path.join(__dirname, path.sep, 'files-copy');
const dirPath = path.join(__dirname, path.sep, 'files');

fs.readdir(dirPath)
  .then(async(files) => {
    await fs.mkdir(newDirPath, {recursive: true})
      .then(async() => {
        for (let file of files){
          const filePath = path.join(dirPath, file);
          const newFilePath = path.join(newDirPath, file);
          await fs.copyFile(filePath, newFilePath);
        }
      });
  });
   