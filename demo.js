const fs = require('fs');

const file = fs.readFileSync('./public/img/hh/b1-1.png');

const jsonFile = Buffer.from(file).toString('base64');

console.log(jsonFile);