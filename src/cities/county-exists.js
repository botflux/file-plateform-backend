/**
 * Returns true if _countyName_ county exists
 * 
 * @param {Function} fetch 
 * @param {Function} encodeURIComponent 
 */
const makeCountyExists = (fetch, encodeURIComponent) => countyName => {
    if (typeof countyName !== 'string')
        return Promise.reject('#countyExists: countyName must be a string')

    const countyParameter = encodeURIComponent(countyName)
    
    return fetch(`https://geo.api.gouv.fr/departements?nom=${countyParameter}&fields=nom`)
        .then(response => response.json())
        .then(data => ( data.length > 0 ))
}

module.exports = makeCountyExists