const fetch = require('node-fetch')
const mongoose = require('mongoose')

const dbConnection = mongoose.connect(process.env.APP_DATABASE_URI, {
    useNewUrlParser: true,
})
const userModel = require('./src/models/user')
const makeApp = require('./src/make-app')

const app = makeApp({
    fetch, 
    dbConnection, 
    userModel,
    settings: {
        appSecret: process.env.APP_SECRET,
        tokenHeader: process.env.TOKEN_HEADER
    }
})

const APPLICATION_PORT = process.env.PORT || 3000

app.listen(APPLICATION_PORT, () => {
    console.log(`Listening on port ${APPLICATION_PORT}.`)
})