const jwt = require('jsonwebtoken')

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