/**
 * Returns last extension of a file
 * 
 * @param {String} filename The filename
 */
const getFileExtension = filename => filename.indexOf('.') !== -1 ? filename.split('.').reverse()[0] : ''

module.exports = getFileExtension
