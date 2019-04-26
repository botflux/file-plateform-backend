const HTTPError = require('../../error/http-error')
const checkParametersIntegrity = require('../../parameters/check-parameters-integrity')

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