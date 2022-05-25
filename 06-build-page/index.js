const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

async function makeDirectory(){
  fsPromises.mkdir(path.join(__dirname, 'project-dist'), {recursive: true}, (err) => {
    if (err) {
      return console.error(err);
    }
  });
}

const newDirPath = path.join(__dirname, path.sep, 'project-dist', 'assets');
const dirPath = path.join(__dirname, path.sep, 'assets');

async function copyDirectory(dirPath, newDirPath){


  fsPromises.readdir(dirPath, { withFileTypes: true})
    .then(async(files) => {
      fs.access(newDirPath, fs.constants.F_OK, function(error) {
        if (error){
          fsPromises.mkdir(newDirPath, {recursive: true})
            .then(async() => {
              for (let file of files){
                if(file.isDirectory()){
                  const newFilePath = path.join(newDirPath, file.name);
                  const filePath = path.join(dirPath, file.name);
                  await fsPromises.mkdir(newFilePath, {recursive: true});
                  await copyDirectory(filePath, newFilePath);
                }
                if(file.isFile()){
                  const newFilePath = path.join(newDirPath, file.name);
                  const filePath = path.join(dirPath, file.name);
                  await fsPromises.copyFile(filePath, newFilePath);
                }
              }
            });

        } else {
          fsPromises.rm(newDirPath, {recursive: true})
            .then(async() => {
              await fsPromises.mkdir(newDirPath, {recursive: true})
                .then(async() => {
                  for (let file of files){
                    if(file.isDirectory()){
                      const newFilePath = path.join(newDirPath, file.name);
                      const filePath = path.join(dirPath, file.name);
                      await fsPromises.mkdir(newFilePath, {recursive: true});
                      await copyDirectory(filePath, newFilePath);
                    }
                    if(file.isFile()){
                      const newFilePath = path.join(newDirPath, file.name);
                      const filePath = path.join(dirPath, file.name);
                      await fsPromises.copyFile(filePath, newFilePath);
                    }
                  }
                });

            });

        }
      });
    }); 
}
async function mergeStyles(){
  const stylesPath = path.join(__dirname, path.sep, 'styles');

  fsPromises.readdir(stylesPath, { withFileTypes: true })
    .then(async(files) => {
      const stylesData = [];
      const writeStream = fs.createWriteStream(path.join(__dirname, path.sep, 'project-dist/', 'style.css'));
    
      for (let file of files) {
        if (file.isFile() && file.name.endsWith('.css')){
          await initReadableStream(stylesData, file)
            .then(stylesData => {
              for (let styleFile of stylesData){
                styleFile = `${styleFile}\n`;
                writeStream.write(styleFile);
              }
            });
        }
      }
    });

  function initReadableStream(stylesData, file) {
    return new Promise(resolve => {
      const readStream = fs.createReadStream(path.join(stylesPath, file.name));

      readStream.on('data', (chunk) => {
        stylesData.push(chunk.toString());
      });
      readStream.on('end', () => resolve(stylesData));
    });
  }

}

async function mergeHTML(){
  const templateHtmlPath = path.join(__dirname, path.sep, 'template.html');
  const htmlPath = path.join(__dirname, path.sep, 'project-dist', 'index.html');
  const componentsPath = path.join(__dirname, path.sep, 'components');
  let htmlData;

  await fsPromises.copyFile(templateHtmlPath, htmlPath);

  const readStream = fs.createReadStream(templateHtmlPath);
  const writeStream = fs.createWriteStream(htmlPath);

  readStream.on('data', async (chunk) => {
    htmlData = chunk.toString();

    const files = await fsPromises.readdir(componentsPath, { withFileTypes: true});
    
    for (let file of files) {
      const componentName = path.basename(file.name, '.html');
      if (file.isFile() && htmlData.includes(`{{${componentName}}}`)){
        const fileData = await fsPromises.readFile(path.join(__dirname, path.sep, 'components', file.name), 'utf-8');
        htmlData = htmlData.replace(`{{${componentName}}}`, fileData);
      }
    }

    await writeStream.write(htmlData);
  });

}

async function buildPage(){
  await makeDirectory();
  await copyDirectory(dirPath, newDirPath);
  await mergeStyles();
  await mergeHTML();
}

buildPage();







