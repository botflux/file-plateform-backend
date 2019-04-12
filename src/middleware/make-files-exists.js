/**
 * Make a file verification middleware that tests if each item of 
 * filename list is present is the request
 * 
 * @param {[]} filenames An array containing all the filename
 */
const makeFileExists = filenames => (req, res, next) => {
    const { files = {} } = req
    
    filenames.forEach(filename => {
        if (!(filename in files)) {
            res
                .status(400)
                .send(`The file ${filename} is missing`)
        }
    })

    next()
}

module.exports = makeFileExists
