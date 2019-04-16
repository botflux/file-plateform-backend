const { Router } = require('express')
const jwt = require('jsonwebtoken')
const password = require('password-hash')
const util = require('util')

const E_CREDENTIALS_NOT_SENT = 'Credentials not sent'
const E_BAD_CREDENTIALS = 'Bad credentials'

class UserRouterError extends Error {
    constructor(...params) {
        super(...params)
    }
}

const makeUserRouter = ({ userModel, settings }) => {
    const router = new Router()

    router.post('/login', (req, res) => {
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
            .then(user => util.promisify(jwt.sign)({ email: user.email, role: user.role }, settings.appSecret))
            .then(token => res.status(200).type('text/plain').send(token))
            // .then(user => {
            //     const token = jwt.sign({ email: user.email, password: user.password }, settings.appSecret)

            //     return res
            //         .status(200)
            //         .type('text/plain')
            //         .send(token)
            // })
            .catch(e => {
                // console.log(JSON.stringify(e, null, 4))
                let message = (e instanceof UserRouterError) ? e.message : 'Something went wrong'

                return res
                    .status(400)
                    .send(message)
            })
        // if (!req.body.email || !req.body.password) {
        //     return res
        //         .status(400)
        //         .send('Credentials not sent')
        // } else {
        //     userModel
        //     .find({ email: req.body.email })
        //     .then(([user]) => {
        //         if (!user) {
        //             throw new Error('Bad credentials')
        //             // res
        //             //     .status(400)
        //             //     .send('Bad credentials')
        //         } else {
        //             if (!password.verify(req.body.password, user.password)) {
        //                 console.log('h')
        //                 throw new Error('Bad credentials')
        //                 // res
        //                 //     .status(400)
        //                 //     .send('Bad credentials')
        //             } else {
        //                 return user
        //             }
        //         }
        //     })
        //     .then(user => {
        //         const token = jwt.sign({
        //             email: user[0].email,
        //             role: user[0].role
        //         }, settings.appSecret)

        //         res
        //             .type('text/plain')
        //             .send(token)
        //     })
        //     .catch(e => {
        //         console.log(e)
        //         res
        //             .status(400)
        //             .send(e)
        //     })
        // }        
    })

    return router
}

module.exports = makeUserRouter