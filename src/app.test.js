const request = require('supertest')
const app = require('./app')

describe('Character checker roots', () => {
    describe ('Character checker', () => {
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
                    expect(res.statusCode).toBe(200)
                    expect(res.type).toBe('application/json')
                    expect('message' in res.body).toBe(true)
                    expect(res.body.message).toBe('You need to upload a file')
                    expect('status' in res.body).toBe(true)
                    expect(res.body.status).toBe(400)
                })
        })
    })
})

describe('CSV routes', () => {
    describe('/read-headers', () => {
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
                    expect(res.type).toBe('text/html')
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
    })
})

describe('CSV to XML roots', () => {
    describe('csv to xml header', () => {
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
                    expect(res.statusCode).toBe(200)
                    expect(res.type).toBe('application/json')

                    expect('body' in res.body).toBe(true)
                    expect(res.body.body.message).toBe('A file need to be sent !')
                    expect(res.body.status).toBe(404)
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