const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, path.sep, 'text.txt');

const readStream = fs.createReadStream(filePath);
readStream.on('data', (chunk)=>{
  console.log(chunk.toString());
});


