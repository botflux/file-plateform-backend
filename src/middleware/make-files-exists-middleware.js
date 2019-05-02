const HTTPError = require('../error/http-error')

/**
 * Make a file verification middleware that tests if each item of 
 * filename list is present is the request
 * 
 * @param {String[]} filenames An array containing all the filename
 */
const makeFileExistsMiddleware = filenames => (req, res, next) => {

    const { files = {} } = req
    const keys = Object.keys(files)

    // console.log(keys, filenames)

    // const missing = ! filenames.reduce ((prev, curr) => {
    //     if (keys.includes(curr))
    //         return prev
    //     else
    //         return false
    // }, true)

    const missing = ! filenames.reduce ((p, n) => keys.includes(n) ? p : false, true)

    // console.log(missing)

    if (missing) {
        next(new HTTPError(400, 'File is missing'))
        // res
        //     .status(400)    
        //     .send(`The file ${missingFiles.reduce((p, n, i) => p + (i !== 0 ? ',' : '') + n, '')} is missing`)
    } else {
        next()
    }

}

module.exports = makeFileExistsMiddleware
