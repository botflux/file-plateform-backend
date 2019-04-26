const isCSV = require('./is-csv')
const getExtension = require('./get-file-extension')

/**
 * Returns true if all files are CSV otherwise false
 * 
 * @param {File[]} files Array with files
 */
const areCSV = files => 
    files.reduce((p, { name, mimetype }) => isCSV(getExtension(name), mimetype) ? p : false, true)

module.exports = areCSV