import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { format } from "timeago.js";

const NotificationMessage = ({ notification }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const notifyType = (type) => {
    if (type === "like") {
      return " hat Like your Post !";
    } else if (type === "likeComment") {
      return " hat Like your Comment !";
    }
  };
  return (
    <NotificationMessageContainer>
      <NotificationMessageWrapper>
        <NotificationMessageTop>
          <NotificationMessageImage
            src={
              notification?.sender?.profilePicture
                ? `${PF}${notification?.sender?.profilePicture}`
                : `${PF}person/noAvatar.png`
            }
          />
          <NotificationMessageName>
            {notification?.sender?.username}{" "}
          </NotificationMessageName>
          <NotificationMessageNotify>
            {notifyType(notification.notifyType)}
          </NotificationMessageNotify>
        </NotificationMessageTop>

        <NotificationMessageBottom>
          <NotificationMessageTime>
            {format(notification?.createdAt)}
          </NotificationMessageTime>
        </NotificationMessageBottom>
      </NotificationMessageWrapper>
      <NotificationMessageHr />
    </NotificationMessageContainer>
  );
};

export default NotificationMessage;

const NotificationMessageContainer = styled.div``;

const NotificationMessageWrapper = styled.div`
  padding: 10px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  &:hover {
    background-color: ${(props) => props.theme.hoverColorPrimary};
  }
`;
const NotificationMessageTop = styled.div`
  display: flex;
  align-items: center;
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
  border: 2px solid ${(props) => props.theme.grayColor};
`;
const NotificationMessageName = styled.span`
  padding: 0 5px;
  font-size: 13px;
  color: ${(props) => props.theme.tintColorPrimary};
`;
const NotificationMessageNotify = styled.span`
  font-size: 12px;
  font-weight: 300;
  color: ${(props) => props.theme.tintColorSecondary};
`;
const NotificationMessageTime = styled.time`
  font-size: 9px;
  font-weight: 300;
  color: ${(props) => props.theme.tintColorSecondary};
`;
const NotificationMessageHr = styled.hr`
  margin: 0;
  border: none;
  border-top: 0.1px solid ${(props) => props.theme.grayColor};
`;
