const makeCheckAuthorizationMiddleware = require('./make-check-authorization-middleware')
const makeCheckPayloadMiddleware = require('./make-check-payload-middleware')

/**
 * A wrapper around checkPayloadMiddleware and checkAuthorizationMiddleware
 * 
 * @param {String[]} authorizedRoles An array containing roles, each roles must be prefix by ROLE_ and be in uppercase
 */
const makeAuthorizationMiddleware = authorizedRoles => [
    makeCheckPayloadMiddleware(),
    makeCheckAuthorizationMiddleware(authorizedRoles)
]

module.exports = makeAuthorizationMiddleware