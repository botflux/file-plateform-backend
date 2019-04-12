const makeCityExists = require('./city-exists')

describe('#cityExists', () => {
    it ('calls fetch', () => {
        const fakeFetch = jest.fn((url) => {
            return Promise.resolve({
                json () {
                    return []
                }
            })
        })


        const cityExists = makeCityExists(fakeFetch, encodeURIComponent)
        return cityExists('Colmar')
            .then(() => {
                expect(fakeFetch.mock.calls.length).toBe(1)
            })
    })

    it ('calls encodeURIComponent', () => {
        const fakeFetch = jest.fn((url) => {
            return Promise.resolve({
                json () {
                    return []
                }
            })
        })
        const fakeEncodeURIComponent = jest.fn(s => encodeURIComponent(s))
        const cityExists = makeCityExists(fakeFetch, fakeEncodeURIComponent)

        return cityExists('Strasbourg')
            .then(() => {
                expect(fakeEncodeURIComponent.mock.calls.length).toBe(1)
            })
    })

    it ('uses the url encoded city name', () => {
        const fakeFetch = jest.fn((url) => {
            expect(url).toBe('https://geo.api.gouv.fr/communes?nom=Une%20ville%20avec%20des%20espaces&fields=nom&format=json')

            return Promise.resolve({
                json () {
                    return []
                }
            })
        })

        const cityExists = makeCityExists(fakeFetch, encodeURIComponent)
        return cityExists('Une ville avec des espaces')
    })

    it('returns true when fetch returns an array with at least one item', () => {
        const fakeFetch = jest.fn((url) => {
            return Promise.resolve({
                json () {
                    return [
                        { nom: 'Colmar' }
                    ]
                }
            })
        })

        const cityExists = makeCityExists(fakeFetch, encodeURIComponent)
        return cityExists('Une ville')
            .then(exists => expect(exists).toBe(true))
    })

    it('returns false when fetch returns an empty array', () => {
        const fakeFetch = jest.fn((url) => {
            return Promise.resolve({
                json () {
                    return []
                }
            })
        }) 

        const cityExists = makeCityExists(fakeFetch, encodeURIComponent)
        return cityExists('Une ville')
            .then(exists => expect(exists).toBe(false))
    })

    it('throws when cityName is not a string', () => {
        const cityExists = makeCityExists(() => {}, () => {})

        return cityExists([])
            .catch(rej => expect(rej).toBe('#cityExists: cityName must be a string'))
    })
})