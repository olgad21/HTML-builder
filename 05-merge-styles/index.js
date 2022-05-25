const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, path.sep, 'styles');

fsPromises.readdir(stylesPath, { withFileTypes: true })
  .then(async(files) => {
    let stylesData;
    const writeStream = fs.createWriteStream(path.join(__dirname, path.sep, 'project-dist/', 'bundle.css'));
    
    for (let file of files) {
      if (file.isFile() && file.name.endsWith('.css')){
        await initReadableStream(stylesData, file)
          .then(stylesData => {
            stylesData = `${stylesData}\n`;
            writeStream.write(stylesData);
          });
      }
    }
  });

function initReadableStream(stylesData, file) {
  return new Promise(resolve => {
    const readStream = fs.createReadStream(path.join(stylesPath, file.name));

    readStream.on('data', (chunk) => {
      stylesData = chunk.toString();
    });
    readStream.on('end', () => resolve(stylesData));
  });
}