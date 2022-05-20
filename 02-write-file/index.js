const fs = require('fs');
const path = require('path');
const readline = require('readline');
const process = require('process');


const filePath = path.join(__dirname, path.sep, 'text.txt');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const writeStream = fs.createWriteStream(filePath);

console.log('Please add your text.');

rl.on('line', (answer) => {
  if (answer === 'exit'){
    rl.close();
  } else {
    writeStream.write(`${answer}\n`, 'utf8');
  }
  
  process.on('SIGINT', () => rl.close()); 
}); 

rl.on('close', () => {
  console.log('Your text is saved. Thank you. rlonclose');
});