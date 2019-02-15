const { Transform } = require('stream')
const regexList = [ /^[a-zA-Z0-9]$/, /^[!"#$%&'()*\+,-.\/]$/, /^[:;<=>?0-9]$/, /^[@a-zA-z]$/, /^[\[\\\]\^_`]$/, /^[{\|}~]$/, /^[¡¢£¤¥¦§¨©ª«¬-®¯\s]$/, /^[°±²³´µ¶·¸¹º»¼½¾¿]$/, /^[ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏ]$/, /^[ÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞß]$/, /^[àáâãäåæçèéêëìíîï]$/, /^[ðñòóôõö÷øùúûüýþÿ]$/]

let line = 1

/**
 * This stream returns non-ISO 8859-1 characters
 */
module.exports = new Transform({
    readableObjectMode: true,

    transform(chunk, encoding, callback) {
        const chunkString = chunk.toString()
        const chunkArray = Array.from(chunkString)
        chunkArray.forEach((c, i) => {
            if (c.match('\n')) line ++

            if (!c.match(regexList[0]) && !c.match(regexList[1]) && !c.match(regexList[2]) && !c.match(regexList[3]) 
            && !c.match(regexList[4]) && !c.match(regexList[5]) && !c.match(regexList[6]) && !c.match(regexList[7]) 
            && !c.match(regexList[8]) && !c.match(regexList[9]) && !c.match(regexList[10]) && !c.match(regexList[11])) {
                
                const firstCharIndex = (i - 20 < 0) ? 0 : i - 20
                const lastCharIndex = (i + 20 >= chunkArray.toString()) ? chunkArray.toString() - 1 : i + 20 
                
                this.push({
                    line,
                    character: c,
                    sample: chunkString.substring(firstCharIndex, lastCharIndex)
                })
            }
        })

        callback()
    }
})


/*
module.exports = readStream => {
    let line = 1
    let issues = []
    
    return new Promise((res, rej) => {
        if (readStream === undefined || readStream === null) rej('Read stream is null or undefined')

        readStream
        .on('data', chunk => {
            const chunkArray = Array.from(chunk.toString())
            chunkArray.forEach((c, i) => {
                if (c.match('\n')) line ++

                if (!c.match(regexList[0]) 
                && !c.match(regexList[1]) 
                && !c.match(regexList[2]) 
                && !c.match(regexList[3]) 
                && !c.match(regexList[4]) 
                && !c.match(regexList[5]) 
                && !c.match(regexList[6]) 
                && !c.match(regexList[7]) 
                && !c.match(regexList[8]) 
                && !c.match(regexList[9]) 
                && !c.match(regexList[10]) 
                && !c.match(regexList[11])) {
                    let firstChar = (i - 20 < 0) ? 0 : i - 20
                    let lastChar = (i + 20 >= chunkArray.length) ? i + 20 : chunkArray.length - 1

                    issues = [...issues, ...[{
                        character: c,
                        line,
                        sample: chunk.substring(firstChar, lastChar)
                    }]]
                }
            })
        })
        .on('end', () => {
            return res(issues)
        })
    })

}*/