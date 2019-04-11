const encodingIsSupported = require('./encoding-is-supported')

describe('#encodingIsSupported', () => {
    it('returns true when utf8 is given', () => {
        expect(encodingIsSupported('utf8')).toBe(true)
    })

    it ('returns true when latin1 is given', () => {
        expect(encodingIsSupported('latin1')).toBe(true)
    })

    it('returns false when another encoding is given', () => {
        expect(encodingIsSupported('windows-1252')).toBe(false)
    })
})