const areCSV = require('../../are-csv')
const HTTPError = require('../../error/http-error')

/**
 * Returns a middleware that check if given files are CSV
 * 
 * @param {String[]} filesToCheck Array containing the property name of each file request.files
 */
const makeFileIsCSVMiddleware = filesToCheck => (req, res, next) => {
    const keys = Object.keys(req.files)

    // interset the keys and filesToCheck
    const filenames = keys.filter(value => -1 !== filesToCheck.indexOf(value))

    const files = filenames.map(n => req.files[n])

    if (areCSV(files)) {
        next()
    } else {
        next(new HTTPError(400, 'Given file is not a CSV'))
    }
}

module.exports = makeFileIsCSVMiddleware