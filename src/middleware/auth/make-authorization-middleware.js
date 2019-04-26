const makeCheckAuthorizationMiddleware = require('./make-check-authorization-middleware')
const makeCheckPayloadMiddleware = require('./make-check-payload-middleware')

const makeAuthorizationMiddleware = authorizedRoles => [
    makeCheckPayloadMiddleware(),
    makeCheckAuthorizationMiddleware(authorizedRoles)
]

module.exports = makeAuthorizationMiddleware