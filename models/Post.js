var mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
    },
    body: {
        type: String,      
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    image: {
        type:String,

    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model("Post",PostSchema);