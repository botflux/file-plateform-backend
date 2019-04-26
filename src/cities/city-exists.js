/**
 * Returns true if the _cityName_ city exists
 * 
 * @param {Function} fetch 
 * @param {Function} encodeURIComponent 
 */
const cityExists = (fetch, encodeURIComponent) => cityName => {
    if (typeof cityName !== 'string')
        return Promise.reject('#cityExists: cityName must be a string') 
        // throw new Error('#cityExists: cityName must be a string')

    const cityParameter = encodeURIComponent(cityName)

    return fetch(`https://geo.api.gouv.fr/communes?nom=${cityParameter}&fields=nom&format=json`)
        .then(response => response.json())
        .then(data => ( data.length > 0 ))
}

module.exports = cityExists