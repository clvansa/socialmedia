import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { axiosInstance } from "../../util/axiosInstance";
import Conversations from "./Conversations";
import { SocketContext } from "../../context/SocketContext";

const ChatMessagerConversation = ({ setCurrentChat, user, currentChat }) => {
  const { setConversations, conversations } = useContext(SocketContext);
  const [active, setActive] = useState("");

  //Get Conversation
  useEffect(() => {
    const getCovnersation = async () => {
      if (!user) return;
      try {
        const res = await axiosInstance.get(`/conversation/`);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getCovnersation();
  }, [user, currentChat]);

  useEffect(() => {
    currentChat && setActive(currentChat._id);
  }, [currentChat]);

  const handleClick = async (conversation) => {
    setCurrentChat(conversation);
    setActive(conversation._id);
    try {
      await axiosInstance.put(`/message/${conversation?._id}`);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteConversation = async (conversationId) => {
    try {
      const res = await axiosInstance.delete(
        `/message/messages/${conversationId}`
      );
      console.log(res.data);
      setConversations(
        conversations.filter(
          (conversation) => conversation._id !== conversationId
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <ChatMenu>
        <ChatMenuWrapper>
          {/* <ChatMenuInput
            placeholder="Search for friends"
            onChange={handleChange}
          /> */}
          {conversations?.map((conversation) => (
            <div
              key={conversation?._id}
              onClick={() => handleClick(conversation)}
            >
              <Conversations
                conversation={conversation}
                currentUser={user}
                active={active}
                deleteConversation={deleteConversation}
              />
            </div>
          ))}
        </ChatMenuWrapper>
      </ChatMenu>
    </>
  );
};

export default ChatMessagerConversation;

const ChatMenu = styled.div`
  flex: 3.5;
  height: calc(100vh - 51px);
  padding-top: 15px;
  overflow-y: scroll;
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
const ChatMenuWrapper = styled.div`
  padding: 10px;
  height: 100%;
`;
const ChatMenuInput = styled.input`
  width: 90%;
  padding: 10px;
  border: none;
  border-radius: 20px;
  color: ${(props) => props.theme.tintColorSecondary};
  background-color: ${(props) => props.theme.inputBackgroundColor};
  &:focus {
    outline: none;
  }
`;
