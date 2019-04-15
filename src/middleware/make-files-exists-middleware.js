/**
 * Make a file verification middleware that tests if each item of 
 * filename list is present is the request
 * 
 * @param {[]} filenames An array containing all the filename
 */
const makeFileExistsMiddleware = filenames => (req, res, next) => {
    const { files = {} } = req
    let missing = false
    let missingFiles = []
    
    filenames.forEach(filename => {
        if (!(filename in files)) {
            missing = true
            missingFiles = [...missingFiles, filename]
        }
    })

    if (missing) {
        res
            .status(400)    
            .send(`The file ${missingFiles.reduce((p, n, i) => p + (i !== 0 ? ',' : '') + n, '')} is missing`)
    } else {
        next()
    }

}

module.exports = makeFileExistsMiddleware
