const jwt = require('jsonwebtoken')

const makeJwtMiddleware = (appSecret, tokenHeader) => (req, res, next) => {
    if (!req.get(tokenHeader)) {
        return res
            .status(400)
            .send('No token sent')
    }

    const token = req.get(tokenHeader)

    try {
        const payload = jwt.verify(token, appSecret)
        req.tokenPayload = payload
        next()
    } catch (e) {
        return res
            .status(400)
            .send('Bad token')
    }
}

module.exports = makeJwtMiddleware