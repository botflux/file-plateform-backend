const makeErrorHandlerMiddleware = require('./make-error-handler-middleware')

const errorHandlerMiddleware = makeErrorHandlerMiddleware()

describe ('#errorHandlerMiddleware', () => {
    it ('calls res.status() and res.send()', () => {
        const e = new Error('An error')
        const res = {
            status: jest.fn(() => res),
            send: jest.fn(() => res)
        }
        
        errorHandlerMiddleware(e, {}, res, () => {})

        expect(res.status).toBeCalledTimes(1)
        expect(res.status).toBeCalledWith(400)
        expect(res.send).toBeCalledTimes(1)
        expect(res.send).toBeCalledWith({ error: true, message: 'An error' })
    })
})