const makeFilesExistsMiddleware = require('./make-files-exists-middleware')
const httpMocks = require('node-mocks-http')

describe('#makeFilesExistsMiddleware', () => {
    it('calls next() when the file is defined', () => {
        const req = httpMocks.createRequest(),
            res = httpMocks.createResponse()

        const middleware = makeFilesExistsMiddleware([ 'myFile' ])

        // define the file
        req.files.myFile = {}

        const next = jest.fn()

        middleware(req, res, next)

        expect(next).toBeCalled()
    })

    it('returns a 400 http response when the file is not defined', () => {
        const req = httpMocks.createRequest()
            res = httpMocks.createResponse()

        const middleware = makeFilesExistsMiddleware([ 'myFile' ])

        req.files.myFiles = undefined

        const next = jest.fn(() => {})

        middleware(req, res, next)

        expect(next).toBeCalledTimes(0)
        expect(res.statusCode).toBe(400)
        expect(res._getData()).toBe('The file myFile is missing')
    })
})