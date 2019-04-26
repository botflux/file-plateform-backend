const HTTPError = require('../../error/http-error')

/**
 * Check if the request object has a payload property
 */
const makeCheckPayloadMiddleware = () => (req, res, next) => {
    if (!req.payload) next (new HTTPError(400, 'No token given'))
    else next()
}

module.exports = makeCheckPayloadMiddleware