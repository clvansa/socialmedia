const mongoose = require('mongoose')
const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        max: 500,
    },
    img: {
        type: String,
    },
    video: {
        type: String
    },
    likes: {
        type: Array,
        default: [],
    },
    location: {
        type: String,
        max: 30
    },
    feeling: {
        name: {
            type: String
        },
        char: {
            type: String
        }
    },
    bookmark: {
        type: Array,
    },
    lastEdit: {
        type: String
    }

}, { timestamps: true })

module.exports = mongoose.model("Post", PostSchema)