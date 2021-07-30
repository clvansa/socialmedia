import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer'

const SocketContext = createContext();
const socket = io("http://localhost:5100/");

const SocketContextProvider = ({ children }) => {
    const [stream, setStream] = useState();
    const [me, setMe] = useState('');
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState('');
    const [videoUsersId, setVideoUsersId] = useState([]);
    const [callers, setCallers] = useState([]);
    const [callRecipient, setCallRecipient] = useState({});

    const [onlineUsers, setOnlineUsers] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [tempMessages, setTempMessages] = useState([]);
    const [arrivalNotification, setArrivalNotification] = useState(null);
    const [conversationId, setConversationId] = useState('');

    const [theme, setTheme] = useState('dark')

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();


    const randomId = () => Math.floor(Math.random() * 999999999999999);


    //Get Messages from Socket
    useEffect(() => {
        socket.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
                isRead: false,
                record: data.record,
                _id: randomId(),
            });
            console.log(data, "ArrivalMessage");
        });

        //Send req to socket that msg is readed
        socket.on("sendSeenMsg", (data) => {
            setTempMessages({
                userId: data.userId,
                receiverId: data.receiverId,
                messages: data.messages,
            });
            console.log(data.conversationId)
            setConversationId(data.conversationId)
        });


        // Get Notification from socket to user 
        socket.on("getNotification", (data) => {
            setArrivalNotification({
                notifyType: data.notifyType,
                postId: data.postId,
                sender: data.sender,
                recipient: data.receiverId,
                isRead: false,
                createdAt: data.createdAt,
                _id: Date.now(),
            });
        })
    }, []);



    useEffect(() => {
        socket.on('me', id => setMe(id));

        socket.on('callUser', ({ from, name: callerName, signal }) => {
            setCall({ isReceivingCall: true, from, name: callerName, signal })
        });



    }, []);

    useEffect(() => {

        socket.on('callEnded', () => {
            if (callers.length > 1) {
                endCall()
            }
        })

    }, [callers])





    // useEffect(() => {
    //     navigator.mediaDevices.getUserMedia({ video: false, audio: true })
    //         .then((currentStream) => {
    //             setStream(currentStream);
    //             if (myVideo.current) {
    //                 myVideo.current.srcObject = currentStream;
    //             }
    //         })
    // }, [callAccepted])




    const sendMessageToSocket = (data) => {
        socket.emit("sendMessage", data);
    }

    const seenMsg = (data) => {
        socket.emit("seenMsg", data);
    }

    const sendNotificationToSocket = (data) => {
        socket.emit("sendNotifiction", data);

    }

    const answerCall = () => {
        navigator.mediaDevices.getUserMedia({ video: false, audio: true })
            .then((stream) => {
                setStream(stream)
                myVideo.current.srcObject = stream;
                setCallAccepted(true);
                const peer = new Peer({ initiator: false, trickle: false, stream });

                setCallers([call.from, me])

                peer.on('signal', (data) => {
                    socket.emit('answerCall', { signal: data, to: call.from })

                })

                peer.on('stream', (currentStream) => {
                    userVideo.current.srcObject = currentStream;

                })

                peer.signal(call.signal)

                connectionRef.current = peer
            })

    };

    const callUser = (id) => {
        navigator.mediaDevices.getUserMedia({ video: false, audio: true })
            .then((stream) => {
                setStream(stream)
                myVideo.current.srcObject = stream;
                const peer = new Peer({ initiator: true, trickle: false, stream });

                setCallers([id, me])
                peer.on('signal', (data) => {
                    socket.emit('callUser', { userToCall: id, signalData: data, from: me, name })
                })

                peer.on('stream', (currentStream) => {
                    userVideo.current.srcObject = currentStream;
                })

                socket.on('callAccepted', (signal) => {
                    setCallAccepted(true);

                    peer.signal(signal)
                })

                connectionRef.current = peer

            })
    };

    const leaveCall = (id) => {
        setCallEnded(true);
        stream.getTracks().forEach(function (track) {
            if (track.readyState == 'live') {
                track.stop();
            }
        });
        setStream(null)
        setCall({})
        setCallAccepted(false)
        connectionRef.current.destroy();
        userVideo.current = null;
        myVideo.current = null;

        const user = callers.find(caller => caller !== id);


        socket.emit('leaveCall', user)
        // window.location.reload()

    };

    const endCall = () => {
        setCallEnded(true);
        stream && stream.getTracks().forEach(function (track) {
            if (track.readyState == 'live') {
                track.stop();
            }
        });
        setStream(null)
        setCall({})
        setCallAccepted(false)
        connectionRef.current.destroy();
        userVideo.current = null;
        myVideo.current = null;
    }



    return (
        <SocketContext.Provider value={{
            call,
            callAccepted,
            myVideo,
            userVideo,
            stream,
            name,
            setName,
            callEnded,
            me,
            callUser,
            leaveCall,
            answerCall,
            setVideoUsersId,
            videoUsersId,
            onlineUsers,
            setOnlineUsers,
            conversations,
            setConversations,
            arrivalMessage,
            setArrivalMessage,
            tempMessages,
            setTempMessages,
            arrivalNotification,
            setArrivalNotification,
            sendMessageToSocket,
            seenMsg,
            sendNotificationToSocket,
            conversationId,
            setCallers,
            callers,
            setCallRecipient,
            callRecipient,
            theme,
            setTheme
        }}>
            {children}
        </SocketContext.Provider>
    )
}

export { SocketContextProvider, SocketContext }
