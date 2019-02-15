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
    
    const { files = {} } = req
    const { file = {} } = files || {}

    if (file === undefined || file === null || Object.keys(file) == 0) {
        return res.json({
            message: 'You need to upload a file'
        })
    }

    let issues = []

    const checker = characterChecker()

    const stream = new Readable()
    stream.push(file.data)
    stream.push(null)

    stream
        .pipe(checker)
        .on('data', o => { 
            issues = [...issues, ...[o]] 
            console.log(o)
        })
        .on('end', () => {
            res.json({
                message: 'Ok',
                result: issues
            })
        })
})

module.exports = app