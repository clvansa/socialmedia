import React from "react";
import styled from "styled-components";
import { format } from "timeago.js";
import { Done, DoneAll } from "@material-ui/icons";

const Message = ({ message, own, currentFriend, currentUser, smallChat }) => {
  const photo = own
    ? currentUser?.profilePicture
    : currentFriend?.profilePicture;
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <MessageContainer own={own}>
      <MessageTop>
        <MessageImg
          src={photo ? `${PF}${photo}` : `${PF}person/noAvatar.png`}
          alt=""
          own={own}
        />
        <MessageText own={own} smallChat={smallChat}>
          {message?.text &&( message.text.includes("www.")  ||  message.text.includes("https")) ? (
            <LinkMesage
              href={`https://${message.text}`}
              target="_blank"
            >
              {message.text}
            </LinkMesage>
          ) : (
            message.text
          )}
          {own && (
            <span
              style={{
                position: "absolute",
                bottom: "12px",
                right: own && "3px",
              }}
            >
              {message.isRead ? (
                <DoneAll style={{ fontSize: "12px", color: "#758655" }} />
              ) : (
                <Done style={{ fontSize: "12px", color: "#758655" }} />
              )}
            </span>
          )}
          {message.record && (
            <MessageAudio>
              <Audio
                src={`${PF}chats/${message.record}`}
                controls={true}
                type="video.webm"
              />
            </MessageAudio>
          )}
        </MessageText>
      </MessageTop>
      <MessageBottom>{format(message.createdAt)}</MessageBottom>
    </MessageContainer>
  );
};

export default Message;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* margin-top: 20px; */
  align-items: ${(props) => props.own && "flex-end"};
  overflow: hidden;
`;
const MessageTop = styled.div`
  display: flex;
  position: relative;
`;
const MessageImg = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
`;
const MessageText = styled.p`
  padding: 10px;
  /* padding-bottom: 20px; */
  border-radius: 10px;
  color: ${(props) => (props.own ? "black" : "white")};
  max-width: ${(props) => (props.smallChat ? "175px" : "300px")};
  background-color: ${(props) => (props.own ? "lightgray" : "#1877f2")};
  word-wrap: break-word;
`;
const MessageBottom = styled.div`
  font-size: 12px;
  position: relative;
  color: gray;
  bottom: 15px;
`;

const MessageAudio = styled.span``;

const Audio = styled.audio`
  filter: sepia(20%) saturate(70%) grayscale(1) contrast(99%) invert(12%);
  width: 180px;
  height: 25px;
  background-color: transparent;

  &::-webkit-media-controls-panel {
    background-color: transparent;
  }

  &&::-webkit-media-controls-play-button {
    /* display: none; */
  }
`;


const LinkMesage = styled.a `
  font-size: 14px;
  text-decoration: underline !important;
  color: blue !important;
`
