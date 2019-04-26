const HTTPError = require('../../error/http-error')

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