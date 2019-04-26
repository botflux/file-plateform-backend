const HTTPError = require('./http-error')

describe('#HTTPError', () => {
    it ('returns the correct name', () => {
        const e = new HTTPError (400)
        expect(e.name).toBe('HTTPError')
    })

    it ('has a status field', () => {
        const e = new HTTPError (500)
        expect(e.httpStatus).toBe(500)
    })

    it ('has a message field', () => {
        const e = new HTTPError (500, 'An error message')
        expect(e.message).toBe('An error message')
    }) 

    it ('has a stack trace', () => {
        const e = new HTTPError (500)
        expect(e).toHaveProperty('stack')
    })

    it ('has a date field', () => {
        const e = new HTTPError (500)
        expect(e).toHaveProperty('date')
    })
})