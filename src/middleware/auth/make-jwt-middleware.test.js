const makeJwtMiddleware = require('./make-jwt-middleware')
const jwt = require('jsonwebtoken') 

describe('#makeJwtMiddleware', () => {
    it ('returns 400 when the header is not sent', () => {
        const req = {
            get: jest.fn(() => {})
        }

        const res = {
            status: jest.fn(() => res),
            send: jest.fn(() => res)
        }

        const middleware = makeJwtMiddleware('secret', 'JWT-TOKEN')
        const next = jest.fn()

        middleware(req, res, next)

        expect(next).toBeCalledTimes(0)
        expect(req.get).toBeCalledWith('JWT-TOKEN')
        expect(res.status).toBeCalledWith(400)
        expect(res.send).toBeCalledWith('No token sent')
    })

    it ('returns 400 when the token is wrong', () => {
        const req = {
            get: jest.fn(() => 'bad token')
        }

        const res = {
            status: jest.fn(() => res),
            send: jest.fn(() => res)
        }

        const middleware = makeJwtMiddleware('secret', 'JWT-TOKEN')
        const next = jest.fn()

        middleware(req, res, next)

        expect(next).toBeCalledTimes(0)
        expect(req.get).toBeCalledWith('JWT-TOKEN')
        expect(res.status).toBeCalledWith(400)
        expect(res.send).toBeCalledWith('Bad token')
    })

    it ('calls next when the token is correct', () => {
        const req = {
            get: jest.fn(() => jwt.sign({ email: 'something' }, 'secret'))
        }

        const res = {
            status: jest.fn(() => res),
            send: jest.fn(() => res)
        }

        const next = jest.fn()

        const middleware = makeJwtMiddleware('secret', 'JWT-TOKEN')

        middleware(req, res, next)

        expect(next).toBeCalled()
    })
})