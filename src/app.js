const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const characterChecker = require('./character-checker')
const fs = require('fs')
const { Readable } = require('stream')

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


    stream
        .pipe(checker)
        // checker stream returns objects containing information about the issue
        // we just add this object to an array
        .on('data', o => { 
            issues = [...issues, ...[o]] 
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

module.exports = app