const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String
    },
    fromGoogle: {
        type: Boolean,
        default: false,
    },
    followers: {
        type: [String]
    },
    following: {
        type: [String]
    },
    profileimg: {
        type: String,
    }
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema);