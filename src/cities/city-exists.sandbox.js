const makeCityExists = require('./city-exists')
const fetch = require('node-fetch')

const cityExists = makeCityExists(fetch, encodeURIComponent)
const cityName = 'existe pas'

cityExists(cityName)
    .then(exists => console.log(`${cityName} ${exists ? 'existe': 'n\'existe pas'}`))