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