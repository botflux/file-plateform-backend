/**
 * Check if a file is a CSV by checking it extension or it mime type.
 * The valid mime types are "text/csv" and "application/csv".
 * 
 * @param {String} extension The extension to check
 * @param {String} mimetype The mimetype
 */
const isCSV = (extension, mimetype) => (
    extension === 'csv' || 
    (mimetype === 'text/csv' || mimetype === 'application/csv')
)

module.exports = isCSV