const router = require('express').Router();
const User = require('../models/User');
const crypto = require('crypto');
const sendEmail = require('../util/sendEmail');


//Register
router.post('/register', async (req, res, next) => {

    try {

        const newUser = await new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            profilePicture: "https://firebasestorage.googleapis.com/v0/b/socialmedia-storge.appspot.com/o/noAvatar.png?alt=media&token=313acc67-ebf3-4bc7-8cb4-d240d4a7510c",
            coverPicture:"https://firebasestorage.googleapis.com/v0/b/socialmedia-storge.appspot.com/o/89cdf980cf7847d29ecc99cfca1e9384.jpg?alt=media&token=06eb4d5e-4a40-4333-91f5-5c03289c9dfd"
        })

        const user = await newUser.save();
        const token = user.getSignedToken()
        res.status(201).json({ token });

    } catch (err) {
        console.log(err)
        res.status(404).json(err.message)
        next()
    }
})



//Login
router.post('/login', async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email }).select('password');

        !user && res.status(404).json('User not found')

        const isMatch = await user.matchPassword(req.body.password)

        if (!isMatch) return res.status(404).json('Worng Password');

        const token = user.getSignedToken()

        res.status(200).json({ token })
    } catch (err) {
        //    return res.status(404).json('Wrong user or Password')
        console.log(err)
        next()
    }
})


router.post('/forgotpassword', async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.status(404).json('Email could not be sent')
        }

        const resetToken = await user.getResetPasswordToken()

        await user.save()

        const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`

        const message = `
            <h1>You have requested a password reset </h1>
            <p>Please go to this link to rest your passsword</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `
        try {
            await sendEmail({
                to: user.email,
                subject: "Password rest request",
                text: message,
            })

        } catch (err) {
            console.log(err)
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save()
        }

        res.status(200).json({ data: "Email has been send " })
    } catch (err) {
        console.log(err)
        next()
    }
})



router.put('/resetpassword/:resetToken', async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash("sha256")
            .update(req.params.resetToken).digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        })

        if (!user) return res.status(400).json('Invaild reset Token')

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(201).json('password reset success')

    } catch (err) {
        console.log(err)
    }
})



module.exports = router