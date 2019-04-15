const app = require('./src/make-app')({
    fetch: require('node-fetch')
})
const APPLICATION_PORT = process.env.PORT || 3000

app.listen(APPLICATION_PORT, () => {
    console.log(`Listening on port ${APPLICATION_PORT}.`)
})