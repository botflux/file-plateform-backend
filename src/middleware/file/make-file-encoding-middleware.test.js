const makeFileEncodingMiddleware = require('./make-file-encoding-middleware')
const { readFileSync } = require('fs')
const HTTPError = require('../../error/http-error')

describe('#makeFileEncodingMiddleware', () => {
    it ('calls next when all the file are using supported encoding', () => {
        const middleware = makeFileEncodingMiddleware([ 'file', 'data' ])
        const req = {
            files: {
                file: {
                    data: Buffer.from(`I'm an utf8 string`)
                },
                data: {
                    data: Buffer.from(`I'm an latin1 string`, 'latin1')
                }
            }
        }

        const next = jest.fn(() => {})

        middleware(req, {}, next)

        expect(next).toBeCalledTimes(1)
        expect(next.mock.calls[0][0]).toBe(undefined)
    })

    it ('calls next with an error when a file is using an unsupported encoding', () => {
        const content = readFileSync('./test/csv/windows1252.csv')

        const middleware = makeFileEncodingMiddleware([ 'file', 'data' ])
        const req = {
            files: {
                file: {
                    data: Buffer.from(`I'm an utf8 string`)
                },
                data: {
                    data: content
                }
            }
        }

        const next = jest.fn(() => {})

        middleware(req, {}, next)

        expect(next).toBeCalledTimes(1)
        expect(next.mock.calls[0][0] instanceof HTTPError).toBe(true)
    })
})