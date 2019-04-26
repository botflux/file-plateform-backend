const checkParametersIntegrity = require('./check-parameters-integrity')

describe('#checkParametersIntegrity', () => {
    it ('returns false when a parameter is missing', () => {
        const b = checkParametersIntegrity(
            [ { name: 'firstName' }, { name: 'lastName' } ], 
            { firstName: '' }
        )
        expect(b).toBe(false)
    })

    it ('returns true when parameters are valid', () => {
        const b = checkParametersIntegrity(
            [ { name: 'firstName' }, { name: 'lastName' } ], 
            { firstName: '', lastName: '' }
        )
        expect(b).toBe(true)
    })
    
    it ('returns false when a parameter is empty when it should not', () => {
        const b = checkParametersIntegrity(
            [ { name: 'firstName' }, { name: 'lastName', empty: false } ], 
            { firstName: 'John', lastName: '' }
        )
        expect(b).toBe(false)
    })

    it ('returns true when a parameter is not empty when it should not', () => {
        const b = checkParametersIntegrity(
            [ { name: 'firstName' }, { name: 'lastName', empty: false } ], 
            { firstName: 'John', lastName: 'Doe' }
        )
        expect(b).toBe(true)
    })
})