const router = require('express').Router();
const serviceAccount = require('../socialmedia-storge-firebase-adminsdk-u2v3l-17ba462f8b.json');
const path = require('path');
const os = require('os');
const multer = require('multer');
const admin = require('firebase-admin');
const uuid = require('uuid-v4')
require('dotenv').config()

const cors = require('cors');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.STORAGE_BUCKET
});


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(os.tmpdir()))
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name)
    }
})

const upload = multer({ storage })

const bucket = admin.storage().bucket();

router.post('/', cors(), upload.single('file'), async (req, res, next) => {
    const { filename, path, mimetype } = req.file;
    console.log({ filename, path, mimetype })
    const generatedToken = uuid();
    const metadata = {
        metadata: {
            firebaseStorageDownloadTokens: generatedToken
        },
        contentType: mimetype,
        cacheControl: 'public, max-age=31536000',
    }

    try {
        await bucket.upload(path, {
            gzip: true,
            metadata: metadata
        });
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${process.env.STORAGE_BUCKET}/o/${filename}?alt=media&token=${generatedToken}`;  //post%2F
        res.status(201).json({ imageUrl });
    } catch (err) {
        console.log(err)
        next()
    }

})

// : if request.auth != null


module.exports = router;