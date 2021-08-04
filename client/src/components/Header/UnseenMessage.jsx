import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { axiosInstance } from "../../util/axiosInstance";
import { format } from "timeago.js";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import decrypt from "../../util/decrypt";

const UnseenMessage = ({ notification, messageLength }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [sender, setSender] = useState({});
  const { user } = useContext(AuthContext);
  const lastMessage = notification[messageLength - 1];
  const history = useHistory();

  const handleClick = async (recipient) => {
    try {
      const res = await axiosInstance.get(
        `/conversation/find/${user._id}/${recipient.sender}`
      );

      await history.push({
        pathname: "/chat",
        state: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    let mounted = true;
    const getUser = async () => {
      try {
        const res = await axiosInstance.get(
          `/users/user?userId=${lastMessage.sender}`
        );
        const decrypted = await decrypt(res.data).then((data) => data);
        if (mounted) {
          setSender(decrypted);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getUser();
    return () => (mounted = false);
  }, []);

  return (
    <NotificationMessageContainer onClick={() => handleClick(lastMessage)}>
      <NotificationMessageWrapper>
        <NotificationMessageTop>
          <NotificationMessageImage src={sender?.profilePicture} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <NotificationMessageName>
              {sender?.username}
            </NotificationMessageName>
            <NotificationMessageNotify>
              {/* hat {notification?.notifyType} your Post ! */}

              {notification && notification[messageLength - 1]?.text}
            </NotificationMessageNotify>
          </div>
        </NotificationMessageTop>

        <NotificationMessageBottom>
          <NotificationMessageTime>
            {format(notification && notification[messageLength - 1]?.createdAt)}{" "}
            hat send {messageLength} messages
          </NotificationMessageTime>
        </NotificationMessageBottom>
      </NotificationMessageWrapper>
      <NotificationMessageHr />
    </NotificationMessageContainer>
  );
};

export default UnseenMessage;

const NotificationMessageContainer = styled.div``;

const NotificationMessageWrapper = styled.div`
  padding: 10px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  &:hover {
    background-color: gray;
  }
`;
const NotificationMessageTop = styled.div`
  display: flex;
  align-items: flex-start;
`;
const NotificationMessageBottom = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const NotificationMessageImage = styled.img`
  width: 30px;
  height: 30px;
  object-fit: cover;
  border-radius: 50%;
  border: 1.5px solid #ffffff;
`;
const NotificationMessageName = styled.span`
  padding: 0 5px;
  font-size: 14px;
  font-weight: 500;
`;
const NotificationMessageNotify = styled.span`
  font-size: 12px;
  padding: 0 5px;
  font-weight: 300;
`;
const NotificationMessageTime = styled.time`
  font-size: 9px;
  font-weight: 300;
`;
const NotificationMessageHr = styled.hr`
  margin: 0;
  border: none;
  border-top: 0.1px solid #e2c9c9;
`;
