const { Router } = require('express')
const jwt = require('jsonwebtoken')
const password = require('password-hash')
const util = require('util')

const makeParametersExistMiddleware = require('../middleware/parameters/make-parameters-exist-middleware')

const E_CREDENTIALS_NOT_SENT = 'Credentials not sent'
const E_BAD_CREDENTIALS = 'Bad credentials'

class UserRouterError extends Error {
    constructor(...params) {
        super(...params)
    }
}

const makeUserRouter = ({ userModel, settings }) => {
    const router = new Router()

    // router.use('/login', [])

    router.post('/login', (req, res) => {
		console.log(req.body)
        if (!req.body.email || !req.body.password) {
            return res
                .status(400)
                .send(E_CREDENTIALS_NOT_SENT)
        }

        return userModel
            .find({ email: req.body.email })
            .then(([ user ]) => {
                if (!user) {
                    throw new UserRouterError(E_BAD_CREDENTIALS)
                }

                return user
            })
            .then(user => {
                if (!password.verify(req.body.password, user.password)) {
                    throw new UserRouterError(E_BAD_CREDENTIALS)
                }

                return user
            })
            .then(async user => ({ payload: { email: user.email, role: user.role }, token: await util.promisify(jwt.sign)({ email: user.email, role: user.role }, settings.appSecret) }))
            .then(data => res.json(data))
            .catch(e => {
                console.log(e.message)
                let message = (e instanceof UserRouterError) ? e.message : 'Something went wrong'

                return res
                    .status(400)
                    .send(message)
            })
    })

    return router
}

module.exports = makeUserRouter