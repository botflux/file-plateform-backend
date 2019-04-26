const makeFileEncodingMiddleware = require('./make-file-encoding-middleware')
const makeFileIsCSVMiddleware = require('./make-file-is-csv-middleware')
const makeFilesExistsMiddleware = require('../make-files-exists-middleware')

/**
 * Returns an array containing fileExistsMiddleware, fileIsCSVMiddleware and fileEncodingMiddleware
 * 
 * @param {String[]} filenames Array containing the property name of each file in request.files
 */
const makeFileCheckerMiddleware = (filenames) => [
    makeFilesExistsMiddleware(filenames),
    makeFileIsCSVMiddleware(filenames),
    makeFileEncodingMiddleware(filenames)
]

module.exports = makeFileCheckerMiddleware