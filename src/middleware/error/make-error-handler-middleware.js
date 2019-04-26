/**
 * Returns the error handler middleware
 */
const makeErrorHandlerMiddleware = () => (err, req, res, next) => {
    res.status(400).send({
        error: true,
        message: err.message
    })
}

module.exports = makeErrorHandlerMiddleware