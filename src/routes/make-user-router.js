const { Router } = require('express')
const jwt = require('jsonwebtoken')

const makeUserRouter = ({ userModel }) => {
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

                    console.log('bc')
                } else {
                    const token = jwt.sign({
                        email: user[0].email,
                        role: user[0].role
                    }, (!process.env.APP_SECRET ? 's3cr3t': process.env.APP_SECRET))

                    res
                        .type('text/plain')
                        .send(token)
                }
            })
            .catch(e => {
                console.log('e', e)
                res
                    .status(400)
                    .send('Something went wrong')
            })
    })

    return router
}

module.exports = makeUserRouter