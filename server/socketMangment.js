// const io = require('./index');


let users = [];
let usersToCall = [];

const addUser = (userId, socketId) => {
    userId &&
        !users.some(user => user.userId === userId) &&
        users.push({ userId, socketId })
}

const addUserCall = (userId, socketId) => {

    if (userId && socketId) {
        let index = usersToCall.findIndex(user => user.userId === userId)
        if (index !== -1) {
            usersToCall[index].socketId = socketId
        } else {
            usersToCall.push({ userId, socketId })
        }
    }
}

const getUserCall = (userId) => {
    return usersToCall.find(user => user.userId === userId)
}

const removeUserCall = (socketId) => {
    usersToCall = usersToCall.filter(user => user.socketId !== socketId)
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId)
}

const getUser = (userId) => {
    return users.find(user => user.userId === userId)
}
module.exports = function (io) {
    //Connect
    io.on('connection', (socket) => {
        socket.on('addUser', (userId) => {
            addUser(userId, socket.id)
            io.emit('getUsers', users)
            socket.emit('me', socket.id);
            io.emit("onlineUsers",usersToCall)

        })
        //Send and get Msg
        socket.on('sendMessage', ({ senderId, receiverId, text, isRead }) => {
            const user = getUser(receiverId)
            // user
            //     ? io.to(user.socketId).emit('getMessage', {
            //         senderId,
            //         text
            //     })
            //     : io.emit('getUsers', users)

            user && io.to(user.socketId).emit('getMessage', {
                senderId,
                text,
                isRead
            })


        })
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
            addUserCall(data.userId, data.socketId)
            console.log("getUserSocket", usersToCall)
            // const user = getUserCall(data.userId)
            // user &&
            //     io.to(user.socketId).emit('onlineUsers', usersToCall)
            io.emit("onlineUsers",usersToCall)
        })


        console.log(users, "here in video ")

        socket.on('callUser', ({ userToCall, signalData, from, name }) => {
            console.log(name)
            io.to(userToCall).emit('callUser', { signal: signalData, from, name })
        })

        socket.on("answerCall", (data) => {
            io.to(data.to).emit("callAccepted", data.signal)
        });


        //Disconnect
        socket.on('disconnect', () => {
            removeUser(socket.id)
            removeUserCall(socket.id)
                
            io.emit('getUsers', users)
            io.emit("onlineUsers",usersToCall)

            socket.broadcast.emit('callEnded') // Check Video call
            console.log('disconnect')

        })
    })
}


