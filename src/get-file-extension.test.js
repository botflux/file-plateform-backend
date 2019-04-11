const getFileExtesion = require('./get-file-extension')

describe('#getFileExtesion', () => {
    it('returns the extension when passing a filename', () => {
        expect(getFileExtesion('file.xml')).toBe('xml')
    })

    it ('returns the last extension of the filename', () => {{
        expect(getFileExtesion('index.html.twig')).toBe('twig')
    }})

    it ('returns an empty string when has no extension', () => {
        expect(getFileExtesion('filename')).toBe('')
    })
})