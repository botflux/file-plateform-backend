const { Router } = require('express')
const csv = require('fast-csv')
const isCSV = require('../is-csv')
const { Readable } = require('stream')
const getFileExtension = require('../get-file-extension')
const getEncoding = require('../get-encoding')
const isEncodingSupported = require('../is-encoding-supported')

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



    const readable = new Readable()
    readable.push(file.data.toString(getEncoding(file.data)))
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

module.exports = router