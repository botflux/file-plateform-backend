const makeParametersExistMiddleware = require('./make-parameters-exist-middleware')
const HTTPError = require('../../error/http-error')

describe('#makeParametersExistMiddleware', () => {
    it ('calls next when no parameter is missing', () => {
        const parametersExistMiddlware = makeParametersExistMiddleware([
            { name: 'firstName' },
            { name: 'lastName' }
        ])

        const req = {
            body: {
                firstName: '',
                lastName: ''
            }
        }
        const next = jest.fn(() => {})

        parametersExistMiddlware(req, {}, next)

        expect(next).toBeCalledTimes(1)
    })
    it ('calls next with an error parameters are missing', () => {
        const parametersExistMiddlware = makeParametersExistMiddleware([
            { name: 'firstName' },
            { name: 'lastName' }
        ])

        const req = {
            body: {
                firstName: ''
            }
        }

        const next = jest.fn(() => {})
        parametersExistMiddlware(req, {}, next)

        expect(next).toBeCalledTimes(1)
        expect(next.mock.calls[0][0] instanceof HTTPError).toBe(true)
    })
    it ('calls next with an error when a mandatory parameter is empty', () => {
        const parametersExistMiddlware = makeParametersExistMiddleware([
            { name: 'firstName' },
            { name: 'lastName', empty: false }
        ])

        const req = {
            body: {
                firstName: 'Hello',
                lastName: ''
            }
        }

        const next = jest.fn(() => {})
        parametersExistMiddlware(req, {}, next)
        
        expect(next).toBeCalledTimes(1)
        expect(next.mock.calls[0][0] instanceof HTTPError).toBe(true)
    })
})