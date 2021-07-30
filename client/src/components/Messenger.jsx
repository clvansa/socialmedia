import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import styled from "styled-components";
import { AuthContext } from "../context/AuthContext";
import ChatOnlineUser from "./ChatOnlineUser";
import Conversations from "./Conversations";
import Message from "./Message";
import Topbar from "./Topbar";
import axios from "axios";
import { io } from "socket.io-client";
import { CodeSharp } from "@material-ui/icons";

const Messenger = () => {
  const {
    user,
    socketRef,
    setOnlineUsers,
    onlineUsers,
    conversations,
    setConversations,
    arrivalMessage,
    setArrivalMessage,
  } = useContext(AuthContext);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentFriend, setCurrentFriend] = useState(null);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(true);
  const [count, setCount] = useState(50);
  const observer = useRef();
  const inputRef = useRef();

  // const [onlineUsers, setOnlineUsers] = useState([]);
  // const socketRef = useRef();
  const scrollRef = useRef();
  const randomId = () => Math.floor(Math.random() * 999999999999999);

  useEffect(() => {
    // socketRef.current = io("ws://localhost:5000");
    socketRef.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
        _id: randomId(),
      });
      console.log(data, "ArrivalMessage");
    });
  }, [socketRef?.current]);

  const lastItem = useCallback(
    (element) => {
      if (isLoading) return
      if (observer.current) {
        observer.current.disconnect();
      }
      console.log(element)
      observer.current = new IntersectionObserver(
        (entries) => {
          console.log("entries", entries)
          if (entries[0].isIntersecting && loadMore) {
            console.log("active", entries);
            setPage((prevPage) => prevPage + 1);
          }
        },
        { threshold: 1 }
      );

      if (element) {
        observer.current.observe(element);
      }
    },
    [isLoading,loadMore]
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // useEffect(() => {
  //   socketRef.current.emit("addUser", user?._id);
  //   socketRef.current.on("getUsers", (users) => {
  //    return setOnlineUsers(
  //       user?.followings.filter((follow) =>
  //         users.some((user) => user.userId === follow)
  //       )
  //     );
  //   });
  // }, [user]);

  //Get Conversation
  useEffect(() => {
    const getCovnersation = async () => {
      try {
        const res = await axios.get(`/conversation/${user?._id}`);
        setConversations(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getCovnersation();
  }, [user]);

  //Get Messages
  // useEffect(() => {
  //   const getMessages = async () => {
  //     try {
  //       const res = await axios.get(`/message/${currentChat?._id}`, {
  //         params: { q: query, page: pageNumber },
  //       });
  //       setMessages(res.data);
  //       console.log(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   getMessages();
  // }, [currentChat]);

  //Get Messages
  useEffect(() => {
    console.log(page);
    if (page == 1) return;
    const getMessages = async () => {
      try {
        // const res = await axios.get(
        //   `/message/msg/${currentChat?._id}?count=10&page=${page}`
        // );
        const res = await axios.get(
          `http://localhost:5000/api/message/msg/${currentChat._id}?count=${count}&page=${page}`
        );

        setSize(res.data.size);
        if (res.data.messages.length === res.data.size) setLoadMore(false);
        setMessages((prvMsg) => [...prvMsg, ...res.data.messages]);
        console.log("query func");
      } catch (err) {
        console.log(err);
      }
    };

    currentChat?._id && getMessages();
  }, [page]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        // const res = await axios.get(
        //   `/message/msg/${currentChat?._id}?count=10&page=${page}`
        // );
        const res = await axios.get(
          `/message/msg/${currentChat?._id}?count=50&page=1`
        );

        setSize(res.data.size);
        setMessages(res.data.messages);
        console.log("worket");
      } catch (err) {
        console.log(err);
      }
    };
    console.log(messages);

    getMessages();
  }, [currentChat]);

  // Send a Message
  const handleSendMsg = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };
    socketRef.current.emit("sendMessage", {
      senderId: user?._id,
      receiverId: currentFriend?._id,
      text: newMessage,
    });
    try {
      const res = await axios.post("/message/", message);
      console.log(res.data);
      console.log(message);
      setMessages((prevMsg) => [res.data, ...prevMsg]);
      setCount((prvCount) => prvCount + 1);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  //get Message from Socket
  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prvState) => [arrivalMessage, ...prvState]);
  }, [arrivalMessage, currentChat]);

  //get Current Friend Information
  useEffect(() => {
    const friendId = currentChat?.members.find(
      (memberId) => memberId !== user?._id
    );
    const getUser = async () => {
      if (!friendId) return;
      try {
        const res = await axios.get(`/users/user?userId=${friendId}`);
        setCurrentFriend(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [user, currentChat]);

  //Scroll into view
  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const items = messages.map((message,index) => {
    if (messages.length === index + 1) {
      return (
        <div key={message?._id} ref={lastItem}>
          {console.log(messages.length)}
          <Message
            message={message}
            own={message.sender === user._id}
            currentFriend={currentFriend}
            currentUser={user}
          />
        </div>
      );
    } else {
      return (
        <div key={message?._id}>
          <Message
            message={message}
            own={message.sender === user._id}
            currentFriend={currentFriend}
            currentUser={user}
          />
        </div>
      );
    }
  });

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
                <ChatBoxTop>{items}</ChatBoxTop>
                <ChatBoxBottom>
                  <ChatMessageInput
                    placeholder="Write a message"
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                    // ref={inputRef}
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
  display: flex;
  flex-direction: column-reverse;
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
