const makeCheckAuthorizationMiddleware = require('./make-check-authorization-middleware')

describe('#makeCheckAuthorizationMiddleware', () => {
    it ('returns a 400 when request has not a tokenPayload property', () => {
        const res = {
            status: jest.fn(() => res),
            send: jest.fn(() => res)
        }

        const req = {

        } 

        const next = jest.fn(() => {}) 

        const middleware = makeCheckAuthorizationMiddleware([])

        middleware(req, res, next)

        expect(res.status).toBeCalledWith(400)
        expect(res.status).toBeCalledTimes(1)
        expect(res.send).toBeCalledWith('No token sent')
        expect(res.send).toBeCalledTimes(1)
        expect(next).toBeCalledTimes(0)
    })

    it ('returns a 403 when the token is not authorized', () => {
        const res = {
            status: jest.fn(() => res),
            send: jest.fn(() => res)
        }

        const req = {
            tokenPayload: { role: 'ROLE_USER' }
        } 
        const next = jest.fn(() => {}) 

        const middleware = makeCheckAuthorizationMiddleware(['ROLE_ADMIN'])

        middleware(req, res, next)

        expect(res.status).toBeCalledWith(403)
        expect(res.status).toBeCalledTimes(1)
        expect(res.send).toBeCalledWith('Forbidden')
        expect(res.send).toBeCalledTimes(1)
        expect(next).toBeCalledTimes(0)
    })

    it ('calls next when the token is authorized', () => {
        const res = {
            status: jest.fn(() => res),
            send: jest.fn(() => res)
        }

        const req = {
            tokenPayload: { role: 'ROLE_USER' }
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
            tokenPayload: { role: 'ROLE_USER' }
        } 
        const next = jest.fn(() => {}) 

        const middleware = makeCheckAuthorizationMiddleware(['ROLE_USER', 'ROLE_ADMIN'])

        middleware(req, res, next)
        req.tokenPayload.role = 'ROLE_ADMIN'
        middleware(req, res, next)

        expect(res.status).toBeCalledTimes(0)
        expect(res.send).toBeCalledTimes(0)
        expect(next).toBeCalledTimes(2)
    })
})