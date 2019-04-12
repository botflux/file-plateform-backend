const existsStream = require('./exists-stream')
const { Readable } = require('stream')

/**
 * Creates a stream with the collection pushed in it
 * 
 * @param {[]} collection A collection
 */
const makeReadableStream = collection => {
    const r = new Readable({
        objectMode: true
    })

    collection.forEach(c => r.push(c))
    r.push(null)

    return r
}

describe('#existsStream', () => {
    it ('caches cities', done => {
        const fakeCityExists = jest.fn(() => Promise.resolve(true))
        const fakeCountyExists = jest.fn(() => Promise.resolve(true))
        const fakeParseColumn = jest.fn(c => c)

        const readStream = makeReadableStream([
            { city: 'city 1', county: 'county 1' },
            { city: 'city 2', county: 'county 2' },
            { city: 'city 1', county: 'county 2' }
        ])

        readStream
            .pipe(existsStream(
                fakeCityExists,
                fakeCountyExists,
                fakeParseColumn
            ))
            .on('data', () => {})
            .on('end', () => {
                expect(fakeCityExists.mock.calls.length).toBe(2)
                done()
            })
    })

    it ('caches counties', done => {
        const fakeCityExists = jest.fn(() => Promise.resolve(true))
        const fakeCountyExists = jest.fn(() => Promise.resolve(true))
        const fakeParseColumn = jest.fn(c => c)

        const readStream = makeReadableStream([
            { city: 'city 1', county: 'county 1' },
            { city: 'city 2', county: 'county 2' },
            { city: 'city 1', county: 'county 2' }
        ])

        readStream
            .pipe(existsStream(
                fakeCityExists,
                fakeCountyExists,
                fakeParseColumn
            ))
            .on('data', () => {})
            .on('end', () => {
                expect(fakeCountyExists.mock.calls.length).toBe(2)
                done()
            })
    })
    it ('calls parseColumn for each line', done => {
        const fakeCityExists = jest.fn(() => Promise.resolve(true))
        const fakeCountyExists = jest.fn(() => Promise.resolve(true))
        const fakeParseColumn = jest.fn(c => c)

        const readStream = makeReadableStream([
            { city: 'city 1', county: 'county 1' },
            { city: 'city 2', county: 'county 2' },
            { city: 'city 1', county: 'county 2' },
            { city: 'city 1', county: 'county 2' },
            { city: 'city 1', county: 'county 2' }
        ])
        
        readStream
            .pipe(existsStream(
                fakeCityExists,
                fakeCountyExists,
                fakeParseColumn
            ))
            .on('data', () => {})
            .on('end', () => {
                expect(fakeParseColumn.mock.calls.length).toBe(5)
                done()
            })

    })

    it ('pushs an object for each wrong county', done => {
        const fakeCityExists = jest.fn()
        
        fakeCityExists
            .mockReturnValueOnce(Promise.resolve(true))
            .mockReturnValueOnce(Promise.resolve(true))
            .mockReturnValueOnce(Promise.resolve(false))
            .mockReturnValueOnce(Promise.resolve(true))

        const fakeCountyExists = jest.fn(() => Promise.resolve(true))
        const fakeParseColumn = jest.fn(c => c)

        makeReadableStream([
            { city: 'a', county: 'a' },
            { city: 'b', county: 'b' },
            { city: 'c', county: 'c' },
            { city: 'd', county: 'd' }
        ])
        .pipe(existsStream(
            fakeCityExists,
            fakeCountyExists,
            fakeParseColumn
        ))
        .once('data', data => {
            expect(data.type).toBe('city')
            expect(data.name).toBe('c')
            expect(data.line).toBe(3)
            done()
        })

    })
    it ('pushs an object for each wrong city', () => {
        const fakeCountyExists = jest.fn()
        
        fakeCountyExists
            .mockReturnValueOnce(Promise.resolve(true))
            .mockReturnValueOnce(Promise.resolve(false))
            .mockReturnValueOnce(Promise.resolve(true))
            .mockReturnValueOnce(Promise.resolve(true))

        const fakeCityExists = jest.fn(() => Promise.resolve(true))
        const fakeParseColumn = jest.fn(c => c)

        makeReadableStream([
            { city: 'a', county: 'a' },
            { city: 'b', county: 'b' },
            { city: 'c', county: 'c' },
            { city: 'd', county: 'd' }
        ])
        .pipe(existsStream(
            fakeCityExists,
            fakeCountyExists,
            fakeParseColumn
        ))
        .once('data', data => {
            expect(data.type).toBe('county')
            expect(data.name).toBe('b')
            expect(data.line).toBe(2)
            done()
        })
    })
})