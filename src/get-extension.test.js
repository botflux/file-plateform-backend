const getEncoding = require('./get-encoding')
const { readFileSync } = require('fs')

describe('#getEncoding', () => {
    it('returns utf8 when utf8 is detected', () => {
        const data = readFileSync('test/csv/utf8.csv')
        expect(getEncoding(data)).toBe('utf8')
    })

    it('returns latin1 when iso-8859-1 is detected', () => {
        const data = readFileSync('test/csv/iso88591.csv')
        expect(getEncoding(data)).toBe('latin1')
    })
})