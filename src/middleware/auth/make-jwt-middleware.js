const jwt = require('jsonwebtoken')

/**
 * Returns a middleware that decode the JSON Web token.
 * No error will be propaged if token wasn't sent.
 * An error will be propaged if the token isn't valid
 * 
 * @param {String} appSecret 
 * @param {String} tokenHeader 
 */
const makeJwtMiddleware = (appSecret, tokenHeader) => (req, res, next) => {    
    const token = req.get(tokenHeader)

    if (token) {
        try {
            req.payload = jwt.verify(token, appSecret)
            next()
        } catch (e) {
            next(e)
        }
    } else {
        next()
    }
}

module.exports = makeJwtMiddleware