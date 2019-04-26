const makeCheckPayloadMiddleware = require('./make-check-payload-middleware')
const HTTPError = require('../../error/http-error')
const checkPayloadMiddleware = makeCheckPayloadMiddleware()

describe('#makeCheckPayloadMiddleware', () => {
    it ('calls next when request has a payload property', () => {
        const req = {
            payload: {}
        }

        const next = jest.fn(() => {})

        checkPayloadMiddleware(req, {}, next)

        expect(next).toBeCalledTimes(1)
    })

    it ('calls next with an error when request has no payload property', () => {
        const req = {}
        const next = jest.fn(() => {})
        checkPayloadMiddleware(req, {}, next)
        
        expect(next).toBeCalledTimes(1)
        expect(next.mock.calls[0][0] instanceof HTTPError).toBe(true)
    })
})