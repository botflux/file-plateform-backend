const HTTPError = require('../../error/http-error')

/**
 * Returns a middleware that check if the given user is authorized.
 * If not a HTTPError will be passed to next
 * 
 * @param {String[]} authorizedRoles A list of roles
 */
const makeCheckAuthorizationMiddleware = authorizedRoles => (req, res, next) => {
    if (!authorizedRoles.includes(req.payload.role))
        // return res
        //     .status(403)
        //     .send('Forbidden')
        next(new HTTPError(403, 'Forbidden'))
    else
        next()
}

module.exports = makeCheckAuthorizationMiddleware