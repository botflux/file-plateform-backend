const { makeUserExists } = require('./user-service')

describe('#userService', () => {
    describe('#makeUserExists', () => {
        it ('returns false when no user where found', () => {
            const UserModel = {
                find: jest.fn(() => Promise.resolve([]))
            }

            return makeUserExists(UserModel)('e@m.f', 'secret')
                .then(exists => {
                    expect(exists).toBe(false)
                    expect(UserModel.find).toBeCalled()
                })
        })

        it('returns true when no user where found', () => {
            const UserModel = {
                find: jest.fn(() => Promise.resolve([ 'an item' ]))
            }

            return makeUserExists(UserModel)('e@m.f', 'secret')
                .then(exists => {
                    expect(exists).toBe(true)
                    expect(UserModel.find).toBeCalled()
                    expect(UserModel.find).toBeCalledWith({
                        email: 'e@m.f',
                        password: 'secret'
                    })
                })
        })
    })
})