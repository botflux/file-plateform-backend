const areCSV = require('./are-csv')

describe ('#areCSV', () => {
    it ('returns true when all the file are CSV', () => {
        const b = areCSV([
            { name: 'hello.csv', mimetype: 'text/csv' },
            { name: 'data.csv', mimetype: 'application/csv' },
        ])

        expect(b).toBe(true)
    })
    it ('returns false when a file is not CSV', () => {
        const b = areCSV([
            { name: 'data.csv', mimetype: 'text/csv' },
            { name: 'index.html', mimetype: 'text/html' }
        ])

        expect(b).toBe(false)
    })
})