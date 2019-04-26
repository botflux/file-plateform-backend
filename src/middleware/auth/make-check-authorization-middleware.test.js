const makeCheckAuthorizationMiddleware = require('./make-check-authorization-middleware')
const HTTPError = require('../../error/http-error')

describe('#makeCheckAuthorizationMiddleware', () => {

    it ('calls next with an error when the token is not authorized', () => {
        const res = {
            status: jest.fn(() => res),
            send: jest.fn(() => res)
        }

        const req = {
            payload: { role: 'ROLE_USER' }
        } 
        const next = jest.fn(() => {}) 

        const middleware = makeCheckAuthorizationMiddleware([ 'ROLE_ADMIN' ])

        middleware(req, res, next)

        expect(next).toBeCalledTimes(1)
        expect(next.mock.calls[0][0] instanceof HTTPError).toBe(true)
    })

    it ('calls next when the token is authorized', () => {
        const res = {
            status: jest.fn(() => res),
            send: jest.fn(() => res)
        }

        const req = {
            payload: { role: 'ROLE_USER' }
        } 
        const next = jest.fn(() => {}) 

        const middleware = makeCheckAuthorizationMiddleware(['ROLE_USER'])

        middleware(req, res, next)

        expect(res.status).toBeCalledTimes(0)
        expect(res.send).toBeCalledTimes(0)
        expect(next).toBeCalledTimes(1)
    })

    it('calls next when there is 2 roles authorized', () => {
        const res = {
            status: jest.fn(() => res),
            send: jest.fn(() => res)
        }

        const req = {
            payload: { role: 'ROLE_USER' }
        } 
        const next = jest.fn(() => {}) 

        const middleware = makeCheckAuthorizationMiddleware(['ROLE_USER', 'ROLE_ADMIN'])

        middleware(req, res, next)
        req.payload.role = 'ROLE_ADMIN'
        middleware(req, res, next)

        expect(res.status).toBeCalledTimes(0)
        expect(res.send).toBeCalledTimes(0)
        expect(next).toBeCalledTimes(2)
    })
})