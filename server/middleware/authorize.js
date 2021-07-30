const jwt = require('jsonwebtoken');
const User = require('../models/User');


exports.Auth = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        return res.status(401).json('Not authorized to access this page')
    }

    try {
        const decoded = await jwt.decode(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.id)

        if (!user) {
            return res.status(404).json('No user found with this id')
        }

        req.user = user;

        next()
    } catch (err) {
        return res.status(401).json('Not authorized to access this page')
    }
}