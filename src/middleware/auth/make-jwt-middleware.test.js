const makeJwtMiddleware = require('./make-jwt-middleware')
const jwt = require('jsonwebtoken') 

describe('#makeJwtMiddleware', () => {

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
        expect(res.send).toBeCalledTimes(1)
        expect(res.status).toBeCalledTimes(1)
        expect(res.status).toBeCalledWith(400)
        expect(res.send).toBeCalledWith('Bad token')
    })

    it ('calls next when no token sent', () => {
        const req = {
            get: jest.fn(() => {})
        }

        const res = {
            status: jest.fn(() => res),
            send: jest.fn(() => res)
        }

        const next = jest.fn()

        const middleware = makeJwtMiddleware('secret', 'JWT-TOKEN')
        middleware(req, res, next)

        expect(next).toBeCalled()
        expect(res.status).not.toBeCalled()
        expect(res.send).not.toBeCalled()
        expect(req.get).toBeCalled()

    })

    it ('calls next when the token is correct', async () => {
        const token = jwt.sign({ email: 'something' }, 'secret')
        const req = {
            get: jest.fn(() => token)
        }

        const res = {
            status: jest.fn(() => res),
            send: jest.fn(() => res)
        }

        const next = jest.fn()

        const middleware = makeJwtMiddleware('secret', 'JWT-TOKEN')

        middleware(req, res, next)

        expect(req.get).toBeCalledWith('JWT-TOKEN')
        expect(next).toBeCalled()
    })
})