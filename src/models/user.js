const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String,
    password: String,
    role: String
})

const userModel = mongoose.model('User', userSchema)

module.exports = userModel