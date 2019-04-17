const { Readable } = require('stream')

const { Router } = require('express')
const csv = require('fast-csv')

const isCSV = require('../is-csv')
const getFileExtension = require('../get-file-extension')
const getEncoding = require('../get-encoding')
const isEncodingSupported = require('../is-encoding-supported')
const makeFileExistsMiddleware = require('../middleware/make-files-exists-middleware')

const makeJwtMiddleware = require('../middleware/auth/make-jwt-middleware')
const makeAuthorizarionMiddleware = require('../middleware/auth/make-check-authorization-middleware')

/**
 * Make CSV router
 */
const makeCSVRouter = ({ settings }) => {
    
    const router = new Router()

    router.use('/read-headers', [
        makeJwtMiddleware(settings.appSecret, settings.tokenHeader),
        makeAuthorizarionMiddleware(['ROLE_USER', 'ROLE_ADMIN']),
        makeFileExistsMiddleware([ 'file' ])
    ])

    router.post('/read-headers', (req, res) => {
        const { files = {} } = req
        const { file } = files || {}

        let extension = getFileExtension(file.name)

        if (!isCSV(extension, file.mimetype)) {
            return res
                .status(400)
                .send('File is not a CSV')
        }

        const encoding = getEncoding(file.data)

        if (!isEncodingSupported(encoding)) {
            return res 
                .status(400)
                .send('Encoding is not supported')
        }

        const readable = new Readable()
        readable.push(file.data.toString(encoding))
        readable.push(null)

        readable
            .pipe(csv({
                delimiter: ';'
            }))
            .once('data', (data) => {
                res.json({
                    body: {
                        headers: data
                    }
                })
            })
    })

    return router
}

module.exports = makeCSVRouter