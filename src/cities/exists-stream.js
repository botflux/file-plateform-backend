const { Transform } = require('stream')

/**
 * Create an ExistsStream. This stream allows you to check each entry of a stream has a valid county and city name.
 * CityExists: A promise that take a string (city name) and returns true if the city exists otherwise returns false.
 * CountyExists: A promise that take a string (county name) and returns true if the county exists otherwise returns false. 
 * ParseColumns: A function that take an object and returns another object with a field 'name' and 'county', this function must not throw any errors.
 * 
 * @param {Promise} cityExists 
 * @param {Promise} countyExists 
 * @param {Function} parseColumn 
 */
const ExistsStream = (cityExists, countyExists, parseColumn) => {
    /**
     * Store the current line
     */
    let line = 1

    /**
     * Stores cities and counties
     */
    let cache = []

    /**
     * Add a new entry to the cache
     * 
     * @param {String} name City or county name
     * @param {String} type City|County
     * @param {Boolean} exists Is this city/county exists
     */
    const addToCache = (name, type, exists) => {
        cache = [...cache, { name, type, exists }]
        cache = [...new Set(cache)]
    }

    /**
     * Returns the first cached item matching the given name and type
     * 
     * @param {String} name City/County name
     * @param {String} type City|County
     */
    const getCachedItem = (name, type) => {
        return cache.find(c => (c.name === name && c.type === type))
    }

    return new Transform({
        objectMode: true,
        async transform (c, e, cb) {

            const { city = '', county = '' } = parseColumn(c)
            // Cache the current city
            if (!getCachedItem(city, 'city')) {
                addToCache(city, 'city', await cityExists(city))
            }

            // Cache the current county
            if (!getCachedItem(county, 'county')) {
                addToCache(county, 'county', await countyExists(county))
                // console.log(`${county} added to cache`)
            }

            // Push a new object for each city that is not detected by cityExists
            if (getCachedItem(city, 'city').exists === false) {
                this.push({
                    line,
                    type: 'city',
                    name: city,
                    message: `${city} is not a valid city`  
                })
            }

            // Push a new object for each county that is not detected by countyExists
            if (getCachedItem(county, 'county').exists === false) {
                this.push({
                    line,
                    type: 'county',
                    name: county,
                    message: `${county} is not a valid county`
                })
            }

            line++
            return cb()
        },
        final () {
            this.push(null)
        },
        flush (cb) {
            return cb()
        }
    })
}

module.exports = ExistsStream