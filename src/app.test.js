const request = require('supertest')
const app = require('./app')

describe('Character checker roots', () => {
    describe ('Character checker', () => {
        it ('returns the headers of the given csv file (happy path)', () => {
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