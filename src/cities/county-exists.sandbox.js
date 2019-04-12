const countyExists = require('./county-exists')
const fetch = require('node-fetch')
countyExists(fetch, encodeURIComponent)('Cantal')
    .then(exists => console.log(exists))

// fetch(`https://geo.api.gouv.fr/departements?nom=Cantal&fields=nom`)
//     .then(response => response.json())
//     .then(data => console.log(data))