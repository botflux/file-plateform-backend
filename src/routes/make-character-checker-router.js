const characterChecker = require('../character-checker')
const { Readable } = require('stream')
const { Router } = require('express')

const makeCharacterCheckerRouter = () => {    
    const router = new Router()

    router.post('/', (req, res) => {
        
        // get all files from this request
        const { files = {} } = req

        // get the file named 'file'
        const { file = {} } = files

        // if it is not defined then we return a response
        if (file === undefined || file === null || Object.keys(file) == 0) {
            return res.json({
                status: 400,
                message: 'You need to upload a file'
            })
        }

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
                    message: 'Ok',
                    result: issues
                })
            })
    })

    return router
}

module.exports = makeCharacterCheckerRouter