const chardet = require('chardet')

/**
 * Get the encoding of a buffer
 * 
 * @param {Buffer} buffer buffer you want to get the encoding
 */
const getEncoding = buffer => {
    const detectedEncoding = chardet.detect(buffer, { sampleSize: 200 })

    return (detectedEncoding.toLowerCase() === 'utf-8') 
        ? 'utf8' : (detectedEncoding.toLocaleLowerCase() === 'iso-8859-1') 
        ? 'latin1' : ''
}

module.exports = getEncoding