const { Duplex } = require('stream')

/**
 * Create an ExistsStream. This stream allows you to check each entry of a stream has a valid county and city name.
 * CityExists: A promise that take a string (city name) and returns true if the city exists otherwise returns false.
 * CountyExists: A promise that take a string (county name) and returns true if the county exists otherwise returns false. 
 * ParseColumns: A function that take an object and returns another object with a field 'name' and 'county'.
 * 
 * @param {Promise} cityExists 
 * @param {Promise} countyExists 
 * @param {Function} parseColumn 
 */
const ExistsStream = (cityExists, countyExists, parseColumn) => {

    let warning = []
    let line = 1

    return new Duplex({
        async write (c, e, cb) {

            const { name, county } = parseColumn(c)
            
            if (!(await cityExists(name))) {
                warning = [...warning, {
                    line,
                    type: 'name',
                    name,
                    message: `${name} is not a valid city`  
                }]
            }

            if (!(await countyExists(county))) {
                warning = [...warning, {
                    line,
                    type: 'county',
                    name: county,
                    message: `${county} is not a valid county`
                }]
            }

            line++
            
            this.push(c, e)
            cb()
        },
        read () {},
        final () {
            this.push(null)
            // emit an events with all the warning
            this.emit('result', warning)
        }
    })
}

module.exports = ExistsStream