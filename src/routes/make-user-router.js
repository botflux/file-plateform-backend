const { Router } = require('express')
const jwt = require('jsonwebtoken')

const makeUserRouter = ({ userModel, settings }) => {
    const router = new Router()

    router.post('/login', (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res
                .status(400)
                .send('Credentials not sent')
        }

        userModel
            .find({ email: req.body.email, password: req.body.password })
            .then(user => {
                if (user.length === 0) {
                    res
                        .status(400)
                        .send('Bad credentials')

                } else {
                    const token = jwt.sign({
                        email: user[0].email,
                        role: user[0].role
                    }, settings.appSecret)

                    res
                        .type('text/plain')
                        .send(token)
                }
            })
            .catch(() => {
                res
                    .status(400)
                    .send('Something went wrong')
            })
    })

    return router
}

module.exports = makeUserRouter