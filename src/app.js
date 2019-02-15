const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cors = require('cors')

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
    
    // if (Object.keys(req.files))
    
    const { files = {} } = req
    const { file = {} } = files || {}

    console.log(req.files)

    if (file === undefined || file === null || Object.keys(file) == 0) {
        return res.json({
            message: 'You need to upload a file'
        })
    }

    console.log(file)
    return res.json({
        message: 'Ok'
    })
})

module.exports = app