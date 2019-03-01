const reverse = {
    process: ( v ) => {
        return (
            Array.from (v)
                .reverse()
                .join('')
        )
    },
    description: {
        base: 'Retourne une valeur (e.g maya devient ayam)',
    },
    name: 'reverse'
}

const getWords = {
    process: ( v, { word } ) => {
        return (
            v.split(' ')[word]
        ) || ''
    },
    description: {
        base: 'Retourne le n ième mot d\'une chaîne de caractères (e.g Maya Biscotte avec une valeur de 0 renvoie Maya)',
        args: {
            word: 'Le n ième mot à prendre. 0 étant le premier mot.'
        }
    },
    args: {
        word: 0
    },
    name: 'getWords'
}

module.exports = [
    getWords, reverse
]