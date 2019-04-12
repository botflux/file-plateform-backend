const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cors = require('cors')
// const characterCheckerRoutes = require('./routes/character-checker')
const characterCheckerRouter = require('./routes/character-checker')
// const CSVToXMLRoutes = require('./routes/csv-to-xml')
const CSVToXMLRouter = require('./routes/csv-to-xml')
const CSVRouter = require('./routes/csv')
const CitiesRouter = require('./routes/cities')

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

// app.post('/character-checker', characterCheckerRoutes.index)
app.use('/character-checker', characterCheckerRouter)

app.use('/csv-to-xml', CSVToXMLRouter)

app.use('/csv', CSVRouter)

app.use('/cities', CitiesRouter)

// app.post('/csv-to-xml/get-headers', CSVToXMLRoutes.getHeaders)
// app.get('/csv-to-xml/converted/:name', CSVToXMLRoutes.download)
// app.post('/csv-to-xml', CSVToXMLRoutes.index)

module.exports = app