const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const characterCheckerRoutes = require('./routes/character-checker')
const CSVToXMLRoutes = require('./routes/csv-to-xml')

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

app.post('/character-checker', characterCheckerRoutes.index)

app.post('/csv-to-xml/get-headers', CSVToXMLRoutes.getHeaders)

app.get('/csv-to-xml/converted/:name', CSVToXMLRoutes.download)

app.post('/csv-to-xml', CSVToXMLRoutes.index)

module.exports = app