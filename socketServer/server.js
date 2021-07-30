const express = require('express');
const app = express()
const server = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(server, {
    cors: "*",
    methods: ["GET", "POST"]
});
const PORT = process.env.PORT || 5100;


let users = [];

const addUser = (userId, socketId) => {

    if (userId && socketId) {
        let index = users.findIndex(user => user.userId === userId)
        if (index !== -1) {
            users[index].socketId = socketId
        } else {
            users.push({ userId, socketId })
        }
    }
}

const getUser = (userId) => {
    return users.find(user => user.userId === userId)
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId)
}


//Connect
io.on('connection', (socket) => {
    socket.emit('me', socket.id);
    io.emit("onlineUsers", users)

    socket.on('addUser', (userId) => {
        addUser(userId, socket.id)
        io.emit('getUsers', users)
        // console.log(users)

    })
    //Send and get Msg
    socket.on('sendMessage', ({ senderId, receiverId, text, record, isRead }) => {
        const user = getUser(receiverId)

        user && io.to(user.socketId).emit('getMessage', {
            senderId,
            text,
            isRead,
            record
        })
    })


    // Notification

    socket.on('sendNotifiction', (data) => {
        const user = getUser(data.receiverId)
        user &&
            io.to(user.socketId).emit('getNotification', data)
    })

    socket.on('seenMsg', (data) => {
        const user = getUser(data.receiverId)
        user &&
            io.to(user.socketId).emit('sendSeenMsg', data)
    })

    //Video Call 

    socket.on('getUsersSocket', (data) => {
        addUser(data.userId, data.socketId)
        io.emit("onlineUsers", users)
    })



    socket.on('callUser', ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit('callUser', { signal: signalData, from, name })
    })

    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal)
    });

    socket.on('leaveCall', (data) => {
        io.to(data).emit("callEnded")
    })



    //Disconnect
    socket.on('disconnect', () => {
        removeUser(socket.id)

        io.emit('getUsers', users)
        io.emit("onlineUsers", users)

        socket.broadcast.emit('callEnded') // Check Video call
        console.log('disconnect')

    })
})






server.listen(PORT, () => console.log('server is running'))

