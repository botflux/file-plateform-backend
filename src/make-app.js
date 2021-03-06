const express = require('express')

/** Imports middleware */
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cors = require('cors')

const makeErrorHandlerMiddleware = require('./middleware/error/make-error-handler-middleware')
/** */

/** Imports routers */
const makeCharacterCheckerRouter = require('./routes/make-character-checker-router')
const makeCSVToXMLRouter = require('./routes/make-csv-to-xml-router')
const makeCSVRouter = require('./routes/make-csv-router')
const makeCitiesRouter = require('./routes/make-cities-router')
const makeUserRouter = require('./routes/make-user-router')
/** */

/**
 * Takes the app dependencies as an object and returns the app
 * 
 * @param {{}} params An object containing the app dependencies
 */
const makeApp = (dependencies = {}) => {
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

    /**
     * Expose routers
     */
    app.use('/character-checker', makeCharacterCheckerRouter(dependencies))
    app.use('/csv-to-xml', makeCSVToXMLRouter(dependencies))
    app.use('/csv', makeCSVRouter(dependencies))
    app.use('/cities', makeCitiesRouter(dependencies))
    app.use('/', makeUserRouter(dependencies))
    /**! */

    /**
     * Error handler middleware
     */
    app.use(makeErrorHandlerMiddleware())
    /**! */

    return app
}

module.exports = makeApp