const filters = require('./filters')

const getWord = filters.find(f => f.name === 'getWords')
const reverse = filters.find(f => f.name === 'reverse')

describe('getWord', () => {
    it ('returns the first word of a string (happy path)', () => {
        expect(getWord.process('Hello world', { word: 0 })).toBe('Hello')
    })

    it ('returns the second word of a string (happy path 2)', () => {
        expect(getWord.process('Hello world', { word: 1 })).toBe('world')
    })

    it ('returns empty string when the first parameter is undefined', () => {
        expect(getWord.process(undefined, { word: 0 })).toBe('')
    })

    it ('returns empty string when word index is out of range', () => {
        expect(getWord.process('', { word: 1000 })).toBe('')
    })
})

describe('reverse', () => {
    it ('returns the word reversed (happy path)', () => {
        expect(reverse.process('happy path')).toBe('htap yppah')
    })

    it ('returns empty string when the value to process is undefined', () => {
        expect(reverse.process(undefined)).toBe('')
    })
})