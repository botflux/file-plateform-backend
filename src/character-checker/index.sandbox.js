const checker = require('./index')
const fs = require('fs')
const { Readable } = require('stream')

fs.createReadStream('test/test.txt')
    .pipe(checker)
    .on('data', chunk => console.log(chunk))