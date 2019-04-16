/**
 * Returns a function that checks if the user 
 * with the given email and password exists in database
 * 
 * @param {{}} User A mongoose model
 */
const makeUserExists = User => (email, password) => {
    return User
        .find({ email, password })
        .then(foundUsers => (foundUsers.length > 0))
}

const userService = {
    makeUserExists
}

module.exports = userService