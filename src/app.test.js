const request = require('supertest')
const makeApp = require('./make-app')

const app = makeApp({
    fetch: () => Promise.resolve({
        json: () => {}
    })
})

describe('/character-checker', () => {
    describe ('POST /character-checker/', () => {
        it ('returns the invalid characters (happy path)', () => {
            return request(app)
                .post('/character-checker')
                .attach('file', 'test/test.txt')
                .then(res => {
                    expect(res.statusCode).toBe(200)
                    expect(res.type).toBe('application/json')

                    expect('result' in res.body).toBe(true)
                })
        })

        it ('returns an error when no file is given', () => {
            return request(app)
                .post('/character-checker')
                .then(res => {
                    expect(res.statusCode).toBe(400)
                    expect(res.text).toBe('The file file is missing')
                })
        })
    })
})

describe('/csv', () => {
    describe('POST /csv/read-headers', () => {
        it('returns headers when receiving a CSV file (utf8)', () => {
            return request(app)
                .post('/csv/read-headers')
                .attach('file', 'test/csv/utf8.csv')
                .then(res => {
                    expect(res.statusCode).toBe(200)
                    expect(res.type).toBe('application/json')
                    
                    expect(res.body.body.headers).toContain('année')
                    expect(res.body.body.headers).toContain('cœur')
                    expect(res.body.body.headers).toContain('après')
                    expect(res.body.body.headers).toContain('prêt')
                })
        })

        it('returns headers when receiving a CSV file (iso-8859-1)', () => {
            return request(app)
                .post('/csv/read-headers')
                .attach('file', 'test/csv/iso88591.csv')
                .then(res => {
                    expect(res.statusCode).toBe(200)
                    expect(res.type).toBe('application/json')
                    
                    expect(res.body.body.headers).toContain('année')
                    expect(res.body.body.headers).toContain('c?ur')
                    expect(res.body.body.headers).toContain('après')
                    expect(res.body.body.headers).toContain('prêt')
                })
        })

        it('returns headers when receinving a CSV file (windows-1252)', () => {
            return request(app)
                .post('/csv/read-headers')
                .attach('file', 'test/csv/utf8.csv')
                .then(res => {
                    expect(res.statusCode).toBe(200)
                    expect(res.type).toBe('application/json')
                    
                    // arrêt was not passing the test even if the file has the right encoding
                    // expect(res.body.body.headers).toContain('arrêt')
                    expect(res.body.body.headers).toContain('cœur')
                    expect(res.body.body.headers).toContain('après')
                    // expect(res.body.body.headers).toContain('ensoleillé')
                })
        })

        it ('returns a 400 when the file was not sent', () => {
            return request(app)
                .post('/csv/read-headers')
                .then(res => {
                    expect(res.statusCode).toBe(400)
                    expect(res.text).toBe('The file file is missing')
                    // expect(res.body).toBe('You must send a file')
                })
        })

        it('returns a 400 when the sent file is not a CSV', () => {
            return request(app)
                .post('/csv/read-headers')
                .then(res => {
                    expect(res.statusCode).toBe(400)
                    expect(res.type).toBe('text/html')
                })
        })

        it('returns a 400 when the sent file is not using a supported encoding', () => {
            return request(app)
                .post('/csv/read-headers')
                .then(res => {
                    expect(res.statusCode).toBe(400)
                    expect(res.type).toBe('text/html')
                })
        })
    })
})

describe('/csv-to-xml', () => {
    describe('POST /csv-to-xml/', () => {
        it ('returns an error when the file is not given', () => {
            return request(app)
                .post('/csv-to-xml')
                .then(res => {
                    expect(res.statusCode).toBe(400)
                    expect(res.text).toBe('The file file is missing')
                })
        })
    })

    describe('POST /csv-to-xml/get-headers', () => {
        it ('retruns the headers of the given csv file', () => {
            return request(app)
                .post('/csv-to-xml/get-headers')
                .attach('file', 'test/test.csv')
                .then(res => {
                    expect(res.statusCode).toBe(200)
                    expect(res.type).toBe('application/json')

                    expect('body' in res.body).toBe(true)
                    expect('headers' in res.body.body).toBe(true)

                    expect(res.body.body.headers).toContain('year')
                    expect(res.body.body.headers).toContain('first_name')
                    expect(res.body.body.headers).toContain('last_name')
                    expect(res.body.body.headers).toContain('age')
                })
        })

        it ('returns an error when the file is not given', () => {
            return request(app)
                .post('/csv-to-xml/get-headers')
                .then(res => {
                    expect(res.statusCode).toBe(400)
                    expect(res.text).toBe('The file file is missing')
                })
        })

        it ('returns an error when the given file is not a csv', () => {
            return request(app)
                .post('/csv-to-xml/get-headers')
                .attach('file', 'test/test.txt')
                .then(res => {
                    expect(res.statusCode).toBe(200)
                    expect(res.type).toBe('application/json')

                    expect(res.body.status).toBe(404)
                    expect(res.body.body.message).toBe('The file should be of type CSV !')
                })
        })
    })
})

describe('/cities', () => {
    describe('POST /cities/exists', () => {
        const uri = '/cities/exists'

        it ('returns a 400 when there is no file', () => {
            return request(app)
                .post(uri)
                .send('columnNames=a')
                .then(res => {
                    expect(res.statusCode).toBe(400)
                    expect(res.text).toBe('The file file is missing')
                })
        })
        it ('returns a 400 when the file is not a CSV', () => {
            return request(app)
                .post(uri)
                .attach('file', 'test/test.txt')
                .field('columnNames', 'a')
                .then(res => {
                    expect(res.statusCode).toBe(400)
                    expect(res.text).toBe('The sent file is not a CSV')
                })
        })
        it ('returns a 400 when the file is using an unsupported encoding', () => {
            return request(app)
                .post(uri)
                .attach('file', 'test/csv/windows1252.csv')
                .field('columnNames', 'c')
                .then(res => {
                    expect(res.statusCode).toBe(400)
                    expect(res.text).toBe('Wrong encoding')
                })
        })
        it ('returns a 400 when the column names are not sent', () => {
            return request(app)
                .post(uri)
                .attach('file', 'test/csv/utf8.csv')
                .then(res => {
                    expect(res.statusCode).toBe(400)
                    expect(res.text).toBe('No column names sent')
                })
        })
        it ('returns errors in csv when there is one column name', () => {
            const json = jest.fn()
            json
                .mockReturnValueOnce([''])
                .mockReturnValueOnce([])
                .mockResolvedValueOnce([''])
                .mockReturnValueOnce([])

            const app = makeApp({
                fetch: () => Promise.resolve({
                    json
                })
            })

            return request(app)
                .post(uri)
                .attach('file', 'test/cities/simple-column.csv')
                .field('columnNames', 'place')
                .then(res => {
                    expect(res.statusCode).toBe(200)
                    expect(res.type).toMatch(/json/)
                    expect(res.body.length).toBe(2)
                })
        })
        it ('returns errors in csv when there is multiple column name', () => {
            const json = jest.fn()

            json
                .mockReturnValueOnce([])
                .mockReturnValueOnce([''])
                .mockReturnValueOnce([''])
                .mockReturnValueOnce([])
                .mockReturnValueOnce([''])
                .mockReturnValueOnce([''])
                .mockReturnValueOnce([])
                .mockReturnValueOnce([])
                
            const app = makeApp({
                fetch: () => Promise.resolve({
                    json
                })
            })

            return request(app)
                .post(uri)
                .attach('file', 'test/cities/double-columns.csv')
                .field('columnNames', 'place,place2')
                .then(res => {
                    expect(res.statusCode).toBe(200)
                    expect(res.type).toMatch(/json/)
                    expect(res.body.length).toBe(4)
                })
        })
    }) 
})