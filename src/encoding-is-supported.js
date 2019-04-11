/**
 * Check if the given encoding is supported by the application
 * 
 * @param {String} encoding Encoding you want to check
 */
const encodingIsSupported = encoding => (
    encoding === 'latin1' ||
    encoding === 'utf8'
)

module.exports = encodingIsSupported