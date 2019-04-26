const getEncoding = require('../../get-encoding')
const encodingIsSupported = require('../../is-encoding-supported')
const HTTPError = require('../../error/http-error')

const makeFileEncodingMiddleware = fileToCheck => (req, res, next) => {
    const keys = Object.keys(req.files)
    const filenames = keys.filter(v => fileToCheck.includes(v))

    const encodingAreValid = filenames
        .map(n => req.files[n])
        .reduce((p, n) => {
            const encoding = getEncoding(n.data)
            return encodingIsSupported(encoding) ? p : false
        }, true)

    if (encodingAreValid) next()
    else next(new HTTPError(400, 'Encoding is not valid'))
}

module.exports = makeFileEncodingMiddleware