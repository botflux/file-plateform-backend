const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const characterChecker = require('./character-checker')
const { Readable } = require('stream')
const csv = require('fast-csv')
const converter = require('@botflx/data-converter')
const filters = require('./csv-to-xml/filters')
const convert = require('xml-js')
const fs = require('fs')
const path = require('path')

const isCSV = (extension, mimetype) => (extension === 'csv' || (mimetype === 'text/csv' || mimetype === 'application/csv'))

const app = express()

app.use(cors())
app.use(bodyParser.json({
    limit: '50mb'
}))
app.use(bodyParser.urlencoded({ 
    extended: true, 
    limit: '50mb' 
}))
app.use(fileUpload())

app.use(express.static('/result'))

app.post('/character-checker', (req, res) => {
    
    // get all files from this request
    const { files = {} } = req

    // get the file named 'file'
    const { file = {} } = files || {}

    // if it is not defined then we return a response
    if (file === undefined || file === null || Object.keys(file) == 0) {
        return res.json({
            message: 'You need to upload a file'
        })
    }

    // will store all character issues found inside the file
    let issues = []

    // instatiate a new character checker stream
    const checker = characterChecker()

    // instantiate the stream which will carry the file buffer
    const stream = new Readable()
    stream.push(file.data)
    // end of stream
    stream.push(null)

    let id = 0

    stream
        .pipe(checker)
        // checker stream returns objects containing information about the issue
        // we just add this object to an array
        .on('data', o => { 
            issues = [...issues, ...[{...o, ...{id: id++}}]] 
            console.log(o)
        })
        // when every issues are found we returns the array as a JSON.
        .on('end', () => {
            res.json({
                message: 'Ok',
                result: issues
            })
        })
})

app.post('/csv-to-xml/get-headers', (req, res) => {

    const { files = {} } = req
    const { file = {} } = files

    // if there is not file we return a message
    if (Object.keys(file).length === 0) {
        return res.json({
            status: 404,
            body: {
                message: 'A file need to be sent !'
            }
        })
    }

    console.log(file)

    // extract the extension from the filename
    let [ extension = '', ...rest ] = file.name.split('.').reverse()

    console.log(extension, file.mimetype)

    // if the file is not a CSV file then we return directly a message
    if (!isCSV(extension, file.mimetype)) {
        return res.json({
            status: 404,
            body: {
                message: 'The file should be of type CSV !'
            }
        })
    }

    // create a new stream each time
    const readStream = new Readable()
    // we push the content of the file inside the stream
    readStream.push(file.data.toString('latin1'))
    // tell that its the end of the stream
    readStream.push(null)

    // will store the first line of the csv
    let firstLine = null

    // pipe the csv transform stream to readStream
    readStream
        .pipe(csv({
            delimiter: ';'
        }))
        // when the csv stream emit a data
        .on('data', (chunk) => {
            // the first line will be stored
            if (firstLine === null) firstLine = chunk
        })
        // when the stream is finished, we send back the headers
        .on('end', () => {
            res.json({
                status: 200,
                body: {
                    headers: firstLine,
                    filters
                }
            })
        })
})

app.get('/csv-to-xml/converted/:name', (req, res) => {
    if (fs.existsSync(`result/${req.params.name}`)) {
        return res.type('text/xml').download(path.resolve(`result/${req.params.name}`))
    } else {
        return res.json({
            status: 400,
            body: {
                message: 'File not found !'
            }
        })
    }

})

app.post('/csv-to-xml', (req, res) => {

    // get all sent file as an object
    const { files = {} } = req

    // get the file named file (in the form)
    const { file = {} } = files

    // if there is no file sent then we return
    if (Object.keys(file).length === 0) {
        return res.json({
            status: 400,
            body: {
                message: 'You need to send a file !'
            }
        })
    }

    // we get the extension
    const [ extension, ...rest ] = file.name.split('.').reverse()

    // if the file is not a CSV then we return
    if (!isCSV(extension, file.mimetype)) {
        return res.json({
            status: 400,
            body: {
                message: 'The file need to be of type CSV !'
            }
        })
    }

    // we get the map and parse it
    let { map = '{}' } = req.body
    map = JSON.parse(map)

    // we extract field and assign a default value to them
    const { fields = [], documentRoot = 'Root', collectionRoot = 'Element', attributes = {}, declarations = {} } = map

    console.log(map, file)

    // we create a readable stream
    const readStream = new Readable()
    // we push the file data inside this stream
    readStream.push(file.data.toString('latin1'))
    // tell that's the end of this stream
    readStream.push(null)

    // stores all transformed objects
    let transformedObjects = []
    
    console.log(JSON.stringify(fields, null, 4))

    readStream
        /**
         * We pipe the CSV parser stream,
         * it will returns object for each rows
         */
        .pipe(csv({
            delimiter: ';',
            headers: true
        }))
        /**
         * Data converter stream,
         * it will return an object for each object.
         * This stream is here to transform to filter and transform data
         */
        .pipe(converter({
            fields,
            filters
        }))
        /**
         * Each time the converter stream process an object, we add it to the array
         */
        .on('data', data => {
            transformedObjects = [...transformedObjects, data]
            // console.log(data)
        })
        /**
         * When all data are processed,
         * we return all transform object we store the XML as a file and send the file url
         */
        .on('end', () => {
            console.log('end', transformedObjects)

            let resultObject = {
                [documentRoot]: {
                    _attributes: attributes,
                    [collectionRoot]: transformedObjects
                }
            }

            if (Object.keys(declarations) === 0) {
                resultObject._declaration = {
                    _attributes: declarations
                }
            }

            const xml = convert.js2xml(resultObject, { compact: true, spaces: 4 })
            
            const path = `result/${file.name}.xml`

            fs.mkdir('result/', { recursive: true }, e => {
                if (e) throw e

                fs.writeFile(path, xml, 'latin1', e => {
                    if (e) throw e
    
                    res.json({
                        message: 'Ok',
                        body: {
                            file: `csv-to-xml/converted/${file.name}.xml`
                        }
                    })
                })
            })
        })
})

module.exports = app