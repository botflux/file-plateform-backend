const fetch = require('node-fetch')
const mongoose = require('mongoose')
const configuration = require('./config/config')

const dbConnection = mongoose.connect(configuration.db.uri, {
    useNewUrlParser: true,
})
const userModel = require('./src/models/user')
const makeApp = require('./src/make-app')

const app = makeApp({
    fetch, 
    dbConnection, 
    userModel,
    settings: {
        appSecret: configuration.authentication.appSecret,
        tokenHeader: configuration.authentication.tokenHeader
    }
})

const APPLICATION_PORT = process.env.PORT || 3000

app.listen(APPLICATION_PORT, () => {
    console.log(`Listening on port ${APPLICATION_PORT}.`)
})