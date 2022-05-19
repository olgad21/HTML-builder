const fs = require('fs/promises');
const path = require('path');


const dirPath = path.join(__dirname, path.sep, 'secret-folder');
fs.readdir(dirPath, {withFileTypes: true})
  .then(async(files) => {
    for (let file of files){
      if (file.isFile()){
        const filePath = path.join(dirPath, file.name);
        const fileName = path.parse(filePath).name;
        const fileType = path.parse(filePath).ext.substring(1);
        const { size } = await fs.stat(filePath);
        console.log(`${fileName} - ${fileType} - ${size}bytes`);
      }
    }
  });

 