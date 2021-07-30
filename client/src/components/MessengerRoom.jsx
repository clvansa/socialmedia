import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { AuthContext } from "../context/AuthContext";
import ChatOnlineUser from "./ChatOnlineUser";
import Conversations from "./Conversations";
import Message from "./Message";
import Topbar from "./Topbar";
import axios from "axios";
import { io } from "socket.io-client";
import { useImmer } from "use-immer";

const Messenger = () => {
  const {
    user,
    socketRef,
    setOnlineUsers,
    onlineUsers,
    conversations,
    setConversations,
  } = useContext(AuthContext);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  // const [newMessage, setNewMessage] = useState("");
  const [newMessage, setNewMessage] = useImmer("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentFriend, setCurrentFriend] = useState(null);
  // const [onlineUsers, setOnlineUsers] = useState([]);
  // const socketRef = useRef();
  const scrollRef = useRef();
  const randomId = () => Math.floor(Math.random() * 999999999999999);

  //Get Conversation
  useEffect(() => {
    const getCovnersation = async () => {
      try {
        const res = await axios.get(`/conversation/${user?._id}`);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getCovnersation();
  }, [user]);

  useEffect(() => {
    console.log(currentChat);
    currentChat &&
      currentChat.members.includes(user._id) &&
      socketRef.current.emit("joinChat", currentChat._id);
  }, [currentChat]);

  //Get Messages
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`/message/${currentChat?._id}`);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getMessages();
  }, [currentChat]);

  useEffect(() => {
    // socketRef.current = io("ws://localhost:5000", {
    //   transports: [ "polling"]
    // });
    socketRef.current.on("getMsg", (data) => {
      setArrivalMessage({
        sender: data.sender,
        text: data.text,
        createdAt: Date.now(),
        _id: randomId(),
      });
      console.log(data)
    });
  },[socketRef?.current]);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prvState) => [...prvState, arrivalMessage]);
  }, [currentChat, arrivalMessage]);

  // Send a Message
  const handleSendMsg = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };
    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );
    socketRef.current.emit("sendMsg", {
      sender: user._id,
      receiverId,
      text: newMessage,
    });
    try {
      const res = await axios.post("/message/", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  //get Message from Socket

  //get Current Friend Information

  //Scroll into view
  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <>
      <Topbar />
      <MessengerContainer>
        <ChatMenu>
          <ChatMenuWrapper>
            <ChatMenuInput placeholder="Search for friends" />
            {conversations?.map((conversation) => (
              <div
                key={conversation?._id}
                onClick={() => setCurrentChat(conversation)}
              >
                <Conversations conversation={conversation} currentUser={user} />
              </div>
            ))}
            <Conversations />
          </ChatMenuWrapper>
        </ChatMenu>
        <ChatBox>
          <ChatBoxWrapper>
            {currentChat ? (
              <>
                <ChatBoxTop>
                  {messages.map((message) => (
                    <div ref={scrollRef} key={message?._id}>
                      <Message
                        message={message}
                        own={message.sender === user._id}
                        currentFriend={currentFriend}
                        currentUser={user}
                      />
                    </div>
                  ))}
                </ChatBoxTop>
                <ChatBoxBottom>
                  <ChatMessageInput
                    placeholder="Write a message"
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  />
                  <ChatSubmitButton
                    type="submit"
                    onClick={handleSendMsg}
                    disabled={newMessage === "" && true}
                  >
                    send
                  </ChatSubmitButton>
                </ChatBoxBottom>
              </>
            ) : (
              <NoConversation>
                Open a conversation to start a chat.
              </NoConversation>
            )}
          </ChatBoxWrapper>
        </ChatBox>
        <ChatOnline>
          <ChatOnlineWrapper>
            <ChatOnlineUser
              onlineUsers={onlineUsers}
              currentUserId={user?._id}
              setCurrentChat={setCurrentChat}
            />
          </ChatOnlineWrapper>
        </ChatOnline>
      </MessengerContainer>
    </>
  );
};

export default Messenger;

const MessengerContainer = styled.div`
  height: calc(100vh - 70px);
  display: flex;
`;
const ChatMenu = styled.div`
  flex: 3.5;
`;

const ChatMenuInput = styled.input`
  width: 90%;
  padding: 10px 0;
  border: none;
  border-bottom: 1px solid #e1e1e1;
  &:focus {
    outline: none;
  }
`;
const ChatBox = styled.div`
  flex: 5.5;
`;
const ChatOnline = styled.div`
  flex: 3;
`;
const ChatMenuWrapper = styled.div`
  padding: 10px;
  height: 100%;
`;
const ChatBoxWrapper = styled.div`
  padding: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;
const ChatOnlineWrapper = styled.div`
  padding: 10px;
  height: 100%;
`;
const ChatBoxTop = styled.div`
  height: 100%;
  overflow-y: scroll;
  padding-right: 10px;
  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background-color: gray;
  }
`;
const ChatBoxBottom = styled.form`
  margin-top: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ChatMessageInput = styled.textarea`
  width: 80%;
  height: 90px;
  padding: 10px;
`;
const ChatSubmitButton = styled.button`
  width: 70px;
  height: 40px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: teal;
  color: white;
`;

const NoConversation = styled.span`
  position: absolute;
  font-size: 3rem;
  top: 10%;
  color: #ccc8c8;
  cursor: default;
`;
