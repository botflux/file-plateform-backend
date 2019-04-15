const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cors = require('cors')
// const characterCheckerRoutes = require('./routes/character-checker')
const makeCharacterCheckerRouter = require('./routes/make-character-checker-router')
// const CSVToXMLRoutes = require('./routes/csv-to-xml')
const makeCSVToXMLRouter = require('./routes/make-csv-to-xml-router')
const makeCSVRouter = require('./routes/make-csv-router')
const makeCitiesRouter = require('./routes/make-cities-router')

const makeApp = ({ fetch }) => {
    // console.log(makeCSVToXMLRouter())
    const app = express()

    // middleware to add cors headers
    app.use(cors())

    // middleware to parse json bodies
    app.use(bodyParser.json({
        limit: '50mb'
    }))

    // middleware  to parse urlencoded bodies
    app.use(bodyParser.urlencoded({ 
        extended: true, 
        limit: '50mb' 
    }))

    // handle file upload
    app.use(fileUpload())

    // expose the /result folder
    app.use(express.static('/result'))

    app.use('/character-checker', makeCharacterCheckerRouter())

    app.use('/csv-to-xml', makeCSVToXMLRouter())

    app.use('/csv', makeCSVRouter())

    app.use('/cities', makeCitiesRouter(fetch))

    return app
}

module.exports = makeApp