const makeFileIsCSVMiddleware = require('./make-file-is-csv-middleware')
const HTTPError = require('../../error/http-error')

describe('#makeFileIsCSVMiddleware', () => {
    it ('calls next when all the files are CSV', () => {
        const fileIsCSVMiddleware = makeFileIsCSVMiddleware([ 'file', 'data' ])
        
        const req = {
            files: {
                file: {
                    name: 'file.csv',
                    mimetype: 'text/csv'
                },
                data: {
                    name: 'data.csv',
                    mimetype: 'application/csv'
                }
            }
        }

        const next = jest.fn(() => {})

        fileIsCSVMiddleware(req, {}, next)

        expect(next).toBeCalledTimes(1)
    })

    it ('calls next with an error when a file is not a CSV', () => {
        const fileIsCSVMiddleware = makeFileIsCSVMiddleware([ 'file', 'data' ])

        const req = {
            files: {
                file: {
                    name: 'file.csv',
                    mimetype: 'text/csv'
                },
                data: {
                    name: 'data.html',
                    mimetype: 'text/html'
                }
            }
        }

        const next = jest.fn(() => {})

        fileIsCSVMiddleware(req, {}, next)
        
        expect(next).toBeCalledTimes(1)
        expect(next.mock.calls[0][0] instanceof HTTPError).toBe(true)
    })
})