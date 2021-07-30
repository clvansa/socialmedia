const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { Auth } = require('../middleware/authorize')


// Update User 
router.put('/', Auth, async (req, res) => {

    if (req.body.password) {
        try {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt)
        } catch (err) {
            return res.status(500).json(err)
        }
    }
    try {
        const user = await User.findOneAndUpdate({ _id: req.user._id }, {
            $set: req.body
        }, { new: true });
        res.status(200).json('Account has been updated')
    } catch (err) {
        console.log(err)
    }

})

// Delete user
router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json('Account has been deleted')
        } catch (err) {
            console.log(err)
        }
    } else {
        return res.status(403).json("You can delete only your account")

    }
})

// Get User

router.get('/myuser', Auth, async (req, res) => {

    try {
        const user = await User.findById(req.user._id)
        !user && res.status(404).json('user not found')
        res.status(200).json(user)
    } catch (err) {
        console.log(err)
    }

});

// Get Any User

router.get('/user', Auth, async (req, res, next) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        const user = userId
            ? await User.findById(userId)
            : await User.findOne({ username: username })
        !user && res.status(404).json('user not found')
        const { password, updatedAt, ...other } = user._doc
        res.status(200).json(other)
    } catch (err) {
        console.log(err)
        // return res.status(403).json("User not found")
        next()
    }

});

//Update user info 
router.put('/userinfo', Auth, async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id,
            { $set: { userInfo: req.body } }, { new: true })


        res.status(200).json(user.userInfo)

    } catch (err) {
        console.log(err)
        next()
    }

});

//Change Password
router.put('/changepassword', Auth, async (req, res, next) => {
    const { oldPassword, newPassword } = req.body
    try {
        const user = await User.findById(req.user._id).select('password ')
        const isMatch = await user.matchPassword(oldPassword)

        if (!isMatch) {
            res.status(404).json("Password is wrong")
        } else {
            user.password = newPassword
        }

        await user.save()

        res.status(200).json("Password is changed")

    } catch (err) {
        console.log(err)
        next()
    }

});

// Search an users
router.get('/search', async (req, res) => {
    const username = req.query.username;
    try {
        const user = await User.find({
            username: RegExp(username)
        }).select('username profilePicture')
        !user && res.status(404).json('user not found')
        res.status(200).json(user)
    } catch (err) {
        console.log(err)
    }

});

//Get freinds
router.get('/friends/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const friends = await Promise.all(
            user.followings.map(friendId => {
                return User.findById(friendId)
            })
        )
        let friendList = [];
        friends.map(friend => {
            const { _id, username, profilePicture } = friend;
            friendList.push({ _id, username, profilePicture })
        })
        res.status(200).json(friendList)
    } catch (err) {
        console.log(err)
    }
})


//Get Followers 
router.get('/followers/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const follower = await Promise.all(
            user.followers.map(follower => {
                return User.findById(follower).select('username _id profilePicture')
            })
        )
        res.status(200).json(follower)
    } catch (err) {
        console.log(err)
    }
})

//Get freind friend's
// router.get('/friends/friend/:id', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id)
//         const friends = await Promise.all(
//             user.followings.map(friendId => {
//                 return User.findById(friendId)
//             })
//         )
//         let friendList = [];
//         let newFollower = []

//         const friendsId = await friends.map(friend => friend.followings.map(follower => friendList.push(follower)))

//         const friendsList = await Promise.all(
//             friendList?.map((follower) => {
//                 if (follower == req.params.id) return
//                 return User.findById(follower)
//             }))
//         friendsList.map(friend => {

//             if (friend && !user.followings.includes((friend?._id).toString()) && !user.followings.includes((req.params.id).toString())) {
//                 const { _id, profilePicture, username } = friend
//                 newFollower.push({ _id, profilePicture, username })
//             }

//         })
//         let follower = []
//         for (let i = 0; i < newFollower.length; i++) {
//             if (newFollower[i + 1]?._id.toString() !== newFollower[i]?._id.toString()) {
//                 follower.push(newFollower[i])
//             }
//         }
//         res.status(200).json(follower)
//     } catch (err) {
//         console.log(err)
//     }
// })

// Follow a user

router.put('/:id/follow', Auth, async (req, res) => {

    if (req.user._id !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.user._id);

            if (!user.followers.includes(req.user._id)) {
                await user.updateOne({ $push: { followers: req.user._id.toString() } });
                await currentUser.updateOne({ $push: { followings: req.params.id } })
                res.status(200).json("User has been followed")
            } else {
                res.status(403).json("You already follow this user")
            }
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("You cant follow yourself")
    }
})


// Unfollow a user
router.put('/:id/unfollow', Auth, async (req, res) => {
    if (req.user._id !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.user._id);

            if (user.followers.includes(req.user._id)) {
                await user.updateOne({ $pull: { followers: req.user._id.toString() } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } })
                res.status(200).json("User has been unfollowed")
            } else {
                res.status(403).json("You dont follow this user")
            }
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("You cant follow yourself")
    }
})


//Get Notification users

router.get('/notification/', Auth, async (req, res) => {
    try {
        const notification = await Notification.find({
            recipient: req.user._id,
            isRead: false
        }).limit(10).sort({ createdAt: "-1" }).populate('sender', "profilePicture username")

        await res.status(200).json(notification)
    } catch (err) {
        res.status(500).json(err)
    }

})

//update Notification is Readet

router.put('/notification/:id', Auth, async (req, res) => {

    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            {
                isRead: true
            }, { new: true })

        res.status(200).json(notification)
    } catch (err) {
        res.status(500).json(err)
    }

})


//Get freind friend's

router.get('/suggestedfriends', Auth, async (req, res) => {
    let suggestedId = []
    try {
        const user = await User.findById(req.user._id).select('-_id followings ')
        const frinedsFollowings = await Promise.all(
            user.followings.map(friend => (
                User.findById(friend)
            ))
        )


        frinedsFollowings.map(friend => friend.followings.map(followerId => {
            if (followerId !== req.user._id.toString() && !user.followings.includes(followerId) && !suggestedId.includes(followerId)) {
                suggestedId.push(followerId)
            }
        }))


        const suggestedFriends = await Promise.all(
            suggestedId.map((id) => {

                return User.findById(id).select('username profilePicture')
            })
        )

        res.status(200).json(suggestedFriends)
    } catch (err) {
        res.status(500).json(err)
    }

})





module.exports = router