const makeFilesExistsMiddleware = require('./make-files-exists-middleware')
const HTTPError = require('../error/http-error')

describe('#makeFilesExistsMiddleware', () => {
    it('calls next when the file is defined', () => {
        // const req = httpMocks.createRequest(),
        //     res = httpMocks.createResponse()

        const req = {
            files: {
                myFile: {}
            }
        }

        const middleware = makeFilesExistsMiddleware([ 'myFile' ])

        const next = jest.fn()

        middleware(req, {}, next)

        expect(next).toBeCalledTimes(1)
    })

    it('calls next with an error when the file is not defined', () => {

        const req = {
            files: {
                myFile: null
            }
        }

        const middleware = makeFilesExistsMiddleware([ 'myFile' ])

        const next = jest.fn(() => {})

        middleware(req, {}, next)

        expect(next).toBeCalledTimes(1)
        expect(next.mock.calls[0][0] instanceof HTTPError).toBe(true)
    })
})