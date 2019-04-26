const isCSV = require('./is-csv')
const getExtension = require('./get-file-extension')

const areCSV = files => 
    files.reduce((p, { name, mimetype }) => isCSV(getExtension(name), mimetype) ? p : false, true)

module.exports = areCSV