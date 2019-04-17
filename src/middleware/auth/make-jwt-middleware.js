const jwt = require('jsonwebtoken')
const util = require('util')

const makeJwtMiddleware = (appSecret, tokenHeader) => async (req, res, next) => {

    const token = req.get(tokenHeader)

    if (token) {
        try {
            req.tokenPayload = jwt.verify(token, appSecret)
            next()
        } catch (e) {
            res.status(400).send('Bad token')
        }
    } else {
        next()
    }

    // const token = req.get(tokenHeader)

    // if (token) {
    //     console.log('h')
    //     try {
    //         req.tokenPayload = await util.promisify(jwt.verify)(token, appSecret)
    //         next()
    //     } catch (e) {
    //         console.log('hellooooo')
    //         res
    //             .status(400)
    //             .send('Bad token')
    //     }
            
    // } else {
    //     next()
    // }
}

module.exports = makeJwtMiddleware