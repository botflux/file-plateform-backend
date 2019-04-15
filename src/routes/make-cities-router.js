const { Readable } = require('stream')

const { Router } = require('express')
const csv = require('fast-csv')
const JSONStream = require('JSONStream')

const makeFileExistsMiddleware = require('../middleware/make-files-exists')
const isCSV = require('../is-csv')
const isEncodingSupported = require('../is-encoding-supported')
const getFileExtension = require('../get-file-extension')
const getEncoding = require('../get-encoding')
const cityVerificationStream = require('../cities/exists-stream')
const makeCityExists = require('../cities/city-exists')
const makeCountyExists = require('../cities/county-exists')

/**
 * Construct the router from it dependecies
 * 
 * @param {{}} dependencies An object containing router dependencies 
 */
const makeCitiesRouter = ({ fetch }) => {
        
    const router = new Router()

    router.use('/exists', makeFileExistsMiddleware([
        'file'
    ]))

    router.post('/exists', (req, res) => {
        let { columnNames = '' } = req.body

        if (columnNames.length === 0) {
            return res
                .status(400)
                .send('No column names sent')
        }

        if (columnNames.includes(',')) {
            columnNames = columnNames.split(',')
        } else {
            columnNames = [columnNames]
        }

        const { files = {} } = req
        const { file } = files || {}

        // if (!file) {
        //     return res
        //         .status(400)
        //         .send('You must send a file')
        // }

        if (!isCSV(getFileExtension(file.name), file.mimetype)) {
            return res
                .status(400)
                .send('The sent file is not a CSV')
        }

        const encoding = getEncoding(file.data)

        if (!isEncodingSupported(encoding)) {
            return res
                .status(400)
                .send('Wrong encoding')
        }

        const readable = new Readable()
        readable.push(file.data.toString(encoding))
        readable.push(null)

        const jsonTransform = JSONStream.stringify()
        const csvStream = csv({
            delimiter: ';',
            headers: true
        })

        readable
            .pipe(csvStream)

        columnNames
            .map(n => cityVerificationStream(
                makeCityExists(fetch, encodeURIComponent),
                makeCountyExists(fetch, encodeURIComponent),
                column => {
                    const { groups = {} } = new RegExp(/(?<city>.*)\s\((?<county>.*)\)/, 'g').exec(column[n] || '') || {}
                    return groups
                }
            ))
            .forEach(s => csvStream.pipe(s).pipe(jsonTransform))

            jsonTransform.once('data', () => res.type('application/json'))

            jsonTransform
                .pipe(res)
    })

    return router
}

module.exports = makeCitiesRouter