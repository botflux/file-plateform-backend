const { Router } = require('express')
const csv = require('fast-csv')
const isCSV = require('../is-csv')
const { Readable } = require('stream')
const getFileExtension = require('../get-file-extension')
const getEncoding = require('../get-encoding')
const isEncodingSupported = require('../is-encoding-supported')

const makeCSVRouter = () => {
    
    const router = new Router()

    router.post('/read-headers', (req, res) => {
        const { files = {} } = req
        const { file } = files || {}

        console.log(file)

        if (!file) {
            return res
                .status(400)
                .send('You must send a file')
        }

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