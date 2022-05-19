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
    process.exit();
  } 
  process.on('SIGINT', () => {
    process.exit();
  }); 
  process.on('exit', () => {
    console.log('Your text is saved. Thank you.');
    process.exit();
  });
  writeStream.write(`${answer}\n`, 'utf8');
}); 