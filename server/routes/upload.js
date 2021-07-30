const router = require('express').Router()
const multer = require('multer');


//Multer  Post Storge
const postStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/post")
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name)
    }
})


const uploadPost = multer({ storage: postStorage });
router.post('/post', uploadPost.single('file'), async (req, res) => {
    try {
        return res.status(200).json('File uploaded successfully')
    } catch (err) {
        console.log(err)
    }
})



//Multer  Profile Storge
const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/person")
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name)
    }
})

const uploadProfile = multer({ storage: profileStorage });
router.post('/person', uploadProfile.single('file'), async (req, res) => {
    try {
        return res.status(200).json('File uploaded successfully')
    } catch (err) {
        console.log(err)
    }
})


//Multer  Chat Storge
const ChatStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/chats")
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name)
    }
})

const uploadChat = multer({ storage: ChatStorage });
router.post('/chat', uploadChat.single('file'), async (req, res) => {
    try {
        return res.status(200).json('File uploaded successfully')
    } catch (err) {
        console.log(err)
    }
})





module.exports = router