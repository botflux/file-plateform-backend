const makeFileEncodingMiddleware = require('./make-file-encoding-middleware')
const makeFileIsCSVMiddleware = require('./make-file-is-csv-middleware')
const makeFilesExistsMiddleware = require('../make-files-exists-middleware')

const makeFileCheckerMiddleware = (filenames) => [
    makeFilesExistsMiddleware(filenames),
    makeFileIsCSVMiddleware(filenames),
    makeFileEncodingMiddleware(filenames)
]

module.exports = makeFileCheckerMiddleware