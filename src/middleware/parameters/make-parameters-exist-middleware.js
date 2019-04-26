const HTTPError = require('../../error/http-error')
const checkParametersIntegrity = require('../../parameters/check-parameters-integrity')

/**
 * Returns a middleware that checks if parameters are existing.
 * Each entry of parameterList must be an object.
 * { name: "field", empty: true }
 * If empty = true, the field can be empty (it works for string and array)
 * 
 * @param {{}[]} parameterList Array of objet
 */
const makeParametersExistMiddleware = parameterList => (req, res, next) => {
    const { body = {} } = req

    const parametersAreValid = checkParametersIntegrity (parameterList, body)

    if (parametersAreValid) {
        next()
    } else {
        next(new HTTPError(400, 'Missing parameter'))
    }
}

module.exports = makeParametersExistMiddleware