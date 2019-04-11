const isEncodingSuppored = require('./is-encoding-supported')

describe('#encodingIsSupported', () => {
    it('returns true when utf8 is given', () => {
        expect(isEncodingSuppored('utf8')).toBe(true)
    })

    it ('returns true when latin1 is given', () => {
        expect(isEncodingSuppored('latin1')).toBe(true)
    })

    it('returns false when another encoding is given', () => {
        expect(isEncodingSuppored('windows-1252')).toBe(false)
    })
})