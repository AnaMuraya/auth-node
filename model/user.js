const mongoose = require('mongoose');

//create user schema when user is created and check against them when logging in
const userSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    token: {
        type: String,
    }
});

module.exports = mongoose.model('User', userSchema);