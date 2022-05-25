const path = require('path');
const fsPromises = require('fs/promises');
const fs = require('fs');

const newDirPath = path.join(__dirname, path.sep, 'files-copy');
const dirPath = path.join(__dirname, path.sep, 'files');

fsPromises.readdir(dirPath)
  .then(async(files) => {
    fs.access(newDirPath, fs.constants.F_OK, function(error) {
      if (error) {
        fsPromises.mkdir(newDirPath, {recursive: true})
          .then(async() => {
            for (let file of files){
              const filePath = path.join(dirPath, file);
              const newFilePath = path.join(newDirPath, file);
              await fsPromises.copyFile(filePath, newFilePath);
            }
          });
      } else {
        fsPromises.rm(newDirPath, {recursive: true})
          .then(async() => {
            await fsPromises.mkdir(newDirPath, {recursive: true})
              .then(async() => {
                for (let file of files){
                  const filePath = path.join(dirPath, file);
                  const newFilePath = path.join(newDirPath, file);
                  await fsPromises.copyFile(filePath, newFilePath);
                }
              });
          });
            
      }
    }); 
  });
   