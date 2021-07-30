const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { Auth } = require('../middleware/authorize')

//Create a  Post 
router.post('/', Auth, async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost)
    } catch (err) {
        console.log(err)
    }
})

// Update Post 
router.put('/:id', Auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId == req.user._id) {
            await post.updateOne({ $set: req.body });
            res.status(200).json('The post has been updated');
        } else {
            res.status(403).json("You can update only your post")
        }
    } catch (err) {
        console.log(err)
    }
})


// Delete Post 
router.delete('/:id', Auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId == req.user._id) {
            await post.deleteOne({ _id: req.user._id });
            res.status(200).json('The post has been deleted');
        } else {
            res.status(403).json("You can delete only your post")
        }
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
})

// Like - dislike post
router.put('/:id/like', Auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post.likes.includes(req.user._id)) {
            await post.updateOne({ $push: { likes: req.user._id.toString() } })
            const newNotifications = await new Notification({
                notifyType: 'like',
                sender: req.user._id.toString(),
                recipient: post.userId,
                postId: req.params.id
            })
            await newNotifications.save()
            res.status(200).json({ like: true, msg: 'The post has been liked' })
        } else {
            await post.updateOne({ $pull: { likes: req.user._id.toString() } })
            await Notification.findOneAndDelete({
                notifyType: 'like',
                sender: req.user._id.toString(),
                recipient: post.userId,
                postId: req.params.id
            })
            res.status(200).json({ like: false, msg: 'The post has been disliked' })
        }

    } catch (err) {
        console.log(err)
    }
})


// Get Post
router.get('/:id', Auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post)
    } catch (err) {
        console.log(err)
        res.status(404).json('Post not found');
    }
})


// Get timeline
// router.get('/timeline/:userId', async (req, res) => {
//     try {
//         const currentUser = await User.findById(req.params.userId)
//         const userPosts = await Post.find({ userId: currentUser._id });
//         const friendPosts = await Promise.all(
//             currentUser.followings.map(friendId => {
//                 return Post.find({ userId: friendId })
//             })
//         )
//         res.status(200).json(userPosts.concat(...friendPosts))
//     } catch (err) {
//         console.log(err)
//     }
// })

// Get Timeline with Query and Limit
router.get('/timeline/post/', Auth, async (req, res) => {
    const count = +req.query.count;
    const page = +req.query.page
    try {
        // const currentUser = await User.findById(req.params.userId)
        const userPosts = await Post.find({ userId: req.user._id })
            .skip(count * (page - 1)).limit(count).sort({ createdAt: -1 })
        const friendPosts = await Promise.all(
            req.user.followings.map(friendId => {
                return Post.find({ userId: friendId })
                    .skip(count * (page - 1)).limit(count).sort({ createdAt: -1 })
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts).sort((a, b) => b.createdAt - a.createdAt))
    } catch (err) {
        console.log(err)
    }
})

// Get user's all posts
router.get('/profile/:username',Auth, async (req, res) => {
    const count = +req.query.count;
    const page = +req.query.page
    try {
        const user = await User.findOne({ username: req.params.username })
        const userPosts = await Post.find({ userId: user._id })
            .skip(count * (page - 1)).limit(count).sort({ createdAt: -1 });

        res.status(200).json(userPosts)
    } catch (err) {
        console.log(err)
    }
})


//Get Video Post Timeline
router.get('/timeline/video/', Auth, async (req, res) => {
    const count = +req.query.count;
    const page = +req.query.page
    try {
        // const currentUser = await User.findById(req.params.userId)
        const userPosts = await Post.find({ userId: req.user._id, video: { $exists: true, $ne: null } })
            .skip(count * (page - 1)).limit(count).sort({ createdAt: -1 })
        const friendPosts = await Promise.all(
            req.user.followings.map(friendId => {
                return Post.find({ userId: friendId, video: { $exists: true, $ne: null } })
                    .skip(count * (page - 1)).limit(count).sort({ createdAt: -1 })
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts).sort((a, b) => b.createdAt - a.createdAt))
    } catch (err) {
        console.log(err)
    }
})

//Get Bookmark Post Timeline
router.get('/timeline/bookmark/', Auth, async (req, res) => {
    const count = +req.query.count;
    const page = +req.query.page
    try {

        const bookmark = await Post.find({ bookmark: { $in: req.user._id.toString() } })
            .skip(count * (page - 1)).limit(count).sort({ createdAt: -1 })

        res.status(200).json(bookmark)
    } catch (err) {
        console.log(err)
    }
})


//Toggel Bookmark to push or pull user id
router.put('/bookmark/post/:postId', Auth, async (req, res) => {
    const userId = req.user._id.toString();
    try {
        const post = await Post.findById(req.params.postId)

        if (post.bookmark.includes(userId)) {
            await post.updateOne({ $pull: { bookmark: userId } }, { new: true })
        } else {
            await post.updateOne({ $push: { bookmark: userId } }, { new: true })
        }

        return res.status(200).json(post)
    } catch (err) {
        console.log(err)

    }
})

module.exports = router;