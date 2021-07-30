const router = require("express").Router();
const Conversation = require("../models/Conversation");
const Message = require('../models/Message');
const { Auth } = require('../middleware/authorize')


//Create a new Message

router.post('/', Auth, async (req, res) => {
    const newMessage = new Message({
        sender: req.user._id,
        ...req.body,
    });
    try {
        const savedMessage = await newMessage.save()
        res.status(200).json(savedMessage)

    } catch (err) {
        console.log(err);
        res.status(404).json(err)
    }
});

//Get Messages
router.get('/:conversationId', Auth, async (req, res) => {

    try {
        const conversation = await Message.find({
            conversationId: req.params.conversationId
        }).sort({ createdAt: -1 })
        if (conversation) {
            return res.status(200).json(conversation)
        }
        return res.status(400).json('Something went wrong!')
    } catch (err) {
        console.log(err)
    }
})



// Get Messages with query/limit
router.get('/msg/:conversationId', Auth, async (req, res) => {
    const count = +req.query.count;
    const page = +req.query.page
    try {
        const conversation = await Message.find({
            conversationId: req.params.conversationId
        }).skip(count * (page - 1)).limit(count).sort({ createdAt: -1 })

        const response = await Message.find({
            conversationId: req.params.conversationId
        })

        if (conversation) {
            return res.status(200).json({ messages: conversation, size: response.length })
        }
        return res.status(400).json('Something went wrong!')
    } catch (err) {
        console.log(err)
    }
})


//Read Massage 
router.put('/:conversationId', Auth, async (req, res) => {
    const userId = req.user._id
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        })
        messages.map((message) => {
            if (message.sender !== userId) {
                return
            }
        })
        const updateMsg = await Message.updateMany(
            {
                conversationId: req.params.conversationId,
                sender: { $ne: userId }
            },
            { $set: { isRead: true } },
            { multi: true })

        res.status(200).json('message  updated')
    } catch (err) {
        console.log(err)
    }
})


// Get unSeen Messages 
router.get('/unseen/message', Auth, async (req, res) => {
    try {
        const conversations = await Conversation.find({
            members: {
                $in: [req.user._id.toString()]
            }
        })
        const unSeen = await Promise.all(
            conversations.map(conversation => (
                Message.find({
                    conversationId: conversation._id,
                    isRead: false,
                    sender: { $ne: req.user._id }
                })
            ))
        )
        unSeenArray = []
        unSeen.map(messages => messages.map(message => unSeenArray.push(message)))
        res.status(200).json(unSeen)
    } catch (err) {
        console.log(err)
    }
})


//Detete all msg 
router.delete('/messages/:conversationId', Auth, async (req, res, next) => {
    try {
        const messages =  await Message.deleteMany({ conversationId: req.params.conversationId })
        console.log(req.params.conversationId)
        console.log(messages)


        res.status(200).json('Messages has been deleted')

        // res.status(404).json('Messages not found')


    } catch (err) {
        console.log(err)
        next()
    }
})


router.get('/record/1', async (req, res) => {
    try {
        const record = await Message.find({ record: { $exists: true, $ne: null } })
        res.status(200).json(record)
    } catch (err) {
        console.log(err)
    }
})

module.exports = router