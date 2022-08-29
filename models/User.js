const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
 
    name: {
        type: String
    },
    role: {
        type: String,
        default: 'user',
    },
  
    email: {
        type: String,
        required:true
    },
    googleId: {
        type:String,
        required:true
    },
    profilePic: {
        type:String,

    },
    password: {
        type:String,
    },
    fromGoogle: {
        type:Boolean,
        default:false,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }

});

module.exports = mongoose.model("User", UserSchema);