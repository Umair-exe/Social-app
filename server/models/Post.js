const mongoose = require('mongoose');


const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    userName: {
        type:String,
        required:true,
    },
    desc: {
        type: String,
    },
    imgUrl: {
        type: String
    },
    likes: {
        type: [String],
        default: [],
    },
}, { timestamps: true })

module.exports = mongoose.model('Post', PostSchema);