const { Readable } = require('stream')
const { Router } = require('express')

const characterChecker = require('../character-checker')
const makeFileExistsMiddleware = require('../middleware/make-files-exists-middleware')

const makeJwtMiddleware = require('../middleware/auth/make-jwt-middleware')
const makeAuthorizationMiddleware = require('../middleware/auth/make-authorization-middleware')

const makeFileEncodingMiddleware = require('../middleware/file/make-file-encoding-middleware')
const makeFilesExistsMiddleware = require('../middleware/make-files-exists-middleware')
/**
 * Construct the character checker router
 * 
 * @returns {Router}
 */
const makeCharacterCheckerRouter = ({ settings }) => {    
    const router = new Router()

    router.use('/', [
        makeJwtMiddleware(settings.appSecret, settings.tokenHeader),
        // makeAuthorizarionMiddleware(['ROLE_USER', 'ROLE_ADMIN']),
        ...makeAuthorizationMiddleware(['ROLE_USER', 'ROLE_ADMIN']),
        makeFilesExistsMiddleware([ 'file' ]),
        makeFileEncodingMiddleware([ 'file' ]),
    ])

    router.post('/', (req, res) => {
        
        // get all files from this request
        const { files = {} } = req

        // get the file named 'file'
        const { file = {} } = files

        // will store all character issues found inside the file
        let issues = []

        // instatiate a new character checker stream
        const checker = characterChecker()

        // instantiate the stream which will carry the file buffer
        const stream = new Readable()
        stream.push(file.data)
        // end of stream
        stream.push(null)

        let id = 0

        stream
            .pipe(checker)
            // checker stream returns objects containing information about the issue
            // we just add this object to an array
            .on('data', o => { 
                issues = [ 
                    ...issues, 
                    { ...o, id: id++ } 
                ] 
            })
            // when every issues are found we returns the array as a JSON.
            .on('end', () => {
                res.json({
                    error: false,
                    result: issues
                })
            })
    })

    return router
}

module.exports = makeCharacterCheckerRouter