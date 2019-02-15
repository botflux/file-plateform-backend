const characterChecker = require('./index')
const { createReadStream } = require('fs')

const stream = createReadStream('test/MENTIONS.XML') 
const checker = characterChecker()

stream
    .pipe(checker)

stream.on('error', () => console.log('source.error'))
stream.on('finish', () => console.log('source.finish'))
stream.on('end', () => console.log('source.end'))
stream.on('close', () => console.log('source.close'))
checker.on('error', () => console.log('transform.error'))
checker.on('end', () => console.log('transform.end'))
checker.on('close', () => console.log('transform.close'))
checker.on('data', () => console.log('transform.data'))
