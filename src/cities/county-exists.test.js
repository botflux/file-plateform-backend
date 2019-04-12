const makeCountyExists = require('./county-exists')

describe('#countyExists', () => {
    it('calls fetch', () => {
        const fakeFetch = jest.fn(url => {
            return Promise.resolve({
                json () {
                    return []
                }
            })
        })

        const countyExists = makeCountyExists(fakeFetch, encodeURIComponent)
        return countyExists('departement')
            .then(() => expect(fakeFetch.mock.calls.length).toBe(1))
    })


    it ('calls encodeURIComponent', () => {
        const fakeFetch = jest.fn(url => {
            return Promise.resolve({
                json () {
                    return []
                }
            })
        })

        const fakeEncodeURIComponent = jest.fn(encodeURIComponent)

        const countyExists = makeCountyExists(fakeFetch, fakeEncodeURIComponent)

        return countyExists('')
            .then(() => expect(fakeEncodeURIComponent.mock.calls.length).toBe(1))
    })

    it('uses the encoded url', () => {
        const fakeFetch = jest.fn(url => {
            expect(url).toBe('https://geo.api.gouv.fr/departements?nom=un%20departement&fields=nom')

            return Promise.resolve({
                json () {
                    return []
                }
            })
        })

        const countyExists = makeCountyExists(fakeFetch, encodeURIComponent)

        return countyExists('un departement')
    })

    it ('throws when countyName is not a string', () => {
        const countyExists = makeCountyExists(() => {}, () => {})

        return countyExists([])
            .catch(rej => expect(rej).toBe('#countyExists: countyName must be a string'))
    })

    it('returns true when fetch returns an array with at least 1 item', () => {
        const fakeFetch = jest.fn(url => {

            return Promise.resolve({
                json () {
                    return [
                        'item'
                    ]
                }
            })
        })

        const countyExists = makeCountyExists(fakeFetch, encodeURIComponent)
        return countyExists('')
            .then(exists => expect(exists).toBe(true))
    })

    it ('returns false when fetch returns an empty array', () => {
        const fakeFetch = jest.fn(url => {
            return Promise.resolve({
                json () {
                    return []
                }
            })
        })

        const countyExists = makeCountyExists(fakeFetch, encodeURIComponent)
        return countyExists('')
            .then(exists => expect(exists).toBe(false))
    })
})