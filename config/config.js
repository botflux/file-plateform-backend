module.exports = {
    db: {
        uri: process.env.APP_DATABASE_URI
    },
    authentication: {
        appSecret: process.env.APP_SECRET,
        tokenHeader: process.env.TOKEN_HEADER
    }
}