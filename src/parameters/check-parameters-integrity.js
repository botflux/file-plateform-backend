/**
 * Returns true if _requestParameters_ has all items of _parameterList_ as a propertyName
 * 
 * @param {String[]} parameterList List of field name
 * @param {{}[]} requestParameters Object (request.body)
 */
const checkParametersIntegrity = (parameterList, requestParameters) => {
    const keys = Object.keys(requestParameters)

    return parameterList.reduce((p, { name, empty = true }) => {
        // get the key
        const key = keys.find(key => key === name)

        // when a parameter is missing
        if (!key) return false

        const value = requestParameters[key]
        const valueType = typeof value

        // if the value is empty
        if (!empty && (Array.isArray(value) || valueType === 'string') && value.length === 0) {
            return false
        }

        return p
    }, true)
}

module.exports = checkParametersIntegrity