const makeCheckAuthorizationMiddleware = authorizedRoles => (req, res, next) => {
    if (!req.tokenPayload) {
        return res
            .status(400)
            .send('No token sent')
    }

    if (!authorizedRoles.includes(req.tokenPayload.role)) {
        return res
            .status(403)
            .send('Forbidden')
    }

    next()
}

module.exports = makeCheckAuthorizationMiddleware