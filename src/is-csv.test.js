const isCSV = require('./is-csv')

describe('isCSV', () => {
    it ('returns true when the passed extension is csv', () => {
        expect(isCSV('csv', 'text/something')).toBe(true)
    })

    it ('returns true when the passwed mime type is text/csv', () => {
        expect(isCSV('', 'text/csv')).toBe(true)
    })

    it ('returns trye when the passed mime type is application/csv', () => {
        expect(isCSV('', 'application/csv')).toBe(true)
    })

    it ('returns false when the extension and mimetype are not csv', () => {
        expect(isCSV('', '')).toBe(false)
    })

    it ('returns false when parameters are undefined', () => {
        expect(isCSV()).toBe(false)
    })
})