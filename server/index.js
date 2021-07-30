const express = require('express')
const app = express()
const server = require('http').createServer(app);
const PORT = process.env.PORT || 5000;
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const path = require('path');
const multer = require('multer');
const Auth = require('./middleware/authorize')

const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');
const converstationRoute = require('./routes/conversation');
const messageRoute = require('./routes/message');
const commentRoute = require('./routes/comment');
const uploadRoute = require('./routes/upload');


dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ignoreUndefined: true
}, () => { console.log('connect db') })

// Middleware
app.use(cors());
app.use(helmet())
app.use(morgan("common"));
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))

app.use('/images', express.static(path.join(__dirname, 'public/images')))

//Multer
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "public/images")
//     },
//     filename: (req, file, cb) => {
//         cb(null, req.body.name)
//     }
// })

// const upload = multer({ storage });
// app.post('/api/upload', upload.single('file'), async (req, res) => {
//     try {
//         return res.status(200).json('File uploaded successfully')
//     } catch (err) {
//         console.log(err)
//     }
// })

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/conversation', converstationRoute);
app.use('/api/message', messageRoute);
app.use('/api/comments', commentRoute);
app.use('/api/upload', uploadRoute);

app.get('/', (req, res) => {
    res.send('Welcome to homepage')
})

server.listen(PORT, () => console.log('server listening on port ' + PORT))



