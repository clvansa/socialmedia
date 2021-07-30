const router = require("express").Router();
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const { Auth } = require('../middleware/authorize');

//Create Comment 
router.post('/', Auth, async (req, res) => {
    try {
        const newComment = await new Comment({ userId: req.user.id, ...req.body });
        await newComment.save()
        const comment = await Comment.findById(newComment._id).populate('userId', 'username profilePicture')
        res.status(201).json(comment)
    } catch (err) {
        console.log(err)
    }
})

//Get Comments
router.get('/post/:postId', Auth, async (req, res) => {
    const count = +req.query.count;
    const page = +req.query.page;
    try {
        const comments = await Comment.find({
            postId: req.params.postId
        })
            .populate("userId", "username profilePicture")
            .skip(count * (page - 1)).limit(count).sort({ createdAt: -1 })
        res.status(200).json(comments)
    } catch (err) {
        console.log(err)
    }
})


//Update Comment
router.put('/comment/:commentId', Auth, async (req, res) => {

    try {
        const comment = await Comment.findById(req.params.commentId)

        if (String(comment.userId) === String(req.user._id)) {

            const updateComment = await comment.updateOne({ $set: req.body })
            return res.status(200).json('comment has been updated')
        }

        return res.status(400).json('You can update only your comment')

    } catch (err) {
        console.log(err)
    }
})


//Delete Comment
router.delete('/comment/:commentId', Auth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId)

        if (String(comment.userId) === String(req.user._id)) {

            const updateComment = await comment.deleteOne({ _id: req.params.commentId })
            return res.status(200).json('comment has been deleted')
        }

        return res.status(400).json('You can delete only your comment')

    } catch (err) {
        console.log(err)
    }
})


// Like - dislike comment
router.put('/:id/like', Auth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id)
        if (!comment.likes.includes(req.user._id)) {
            await comment.updateOne({ $push: { likes: req.user._id } })
            const newNotifications = await new Notification({
                notifyType: 'likeComment',
                sender: req.user._id,
                recipient: comment.userId,
                postId: comment.postId
            })
            await newNotifications.save()
            res.status(200).json({ like: true, msg: 'The comment has been liked' })
        } else {
            await comment.updateOne({ $pull: { likes: req.user._id } })
            await Notification.findOneAndDelete({
                notifyType: 'likeComment',
                sender: req.user._id,
                recipient: comment.userId,
                postId: comment.postId
            })
            res.status(200).json({ like: false, msg: 'The comment has been disliked' })
        }

    } catch (err) {
        console.log(err)
    }
})


module.exports = router;