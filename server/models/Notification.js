const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    notifyType: {
        type: String,
        enum: ['user', 'like', 'message', 'comment', 'likeComment', 'post']
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    recipient: {
        type: String
    },
    isRead: {
        type: Boolean, default: false
    }
}, { timestamps: true, });

module.exports = mongoose.model('Notification', NotificationSchema);
