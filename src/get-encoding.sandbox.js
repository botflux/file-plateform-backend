const getEncoding = require('./get-encoding')

getEncoding(Buffer.from('é)êêoe'))
getEncoding(Buffer.from('Hello world'))