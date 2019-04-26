/**
 * Error name
 */
const ERROR_NAME = 'HTTPError'

/**
 * HTTPError class
 * 
 * https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Error
 */
class HTTPError extends Error {

    /**
     * Initialize a new instance of HTTPError
     * 
     * @param {Number} httpStatus The http status
     * @param  {...any} params The error class default params
     */
    constructor (httpStatus, ...params) {
        super(...params)
        this.httpStatus = httpStatus

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HTTPError)
        }

        this.name = ERROR_NAME
        this.date = new Date()
    }
}

module.exports = HTTPError