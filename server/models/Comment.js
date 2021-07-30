const mongoose = require('mongoose')
const CommentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    postId: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        max: 500,
    },
    likes: {
        type: Array,
        default: []
    },

    lastEdit: {
        type: String
    }

}, { timestamps: true })

module.exports = mongoose.model("Comment", CommentSchema)