import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import styled from "styled-components";
import { format } from "timeago.js";
import { DeleteForever } from "@material-ui/icons";
import { Tooltip, Button } from "@material-ui/core";
import useOutside from "../../util/useOutside";

const Conversations = ({
  conversation,
  currentUser,
  active,
  deleteConversation,
}) => {
  const [user, setUser] = useState(null);
  const [menuItem, setMenuItem] = useState(false);
  const closeRef = useRef();

  useOutside(closeRef, setMenuItem);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const friendId = conversation?.members.find(
      (memberId) => memberId !== currentUser?._id
    );

    const getUser = async () => {
      if (!friendId) return;
      try {
        const res = await axios.get(`/users/user?userId=${friendId}`);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      setMenuItem(false);
    }
    return () => (mounted = false);
  }, [active]);

  return (
    user && (
      <ConversationsContainer
        key={conversation?._id}
        active={conversation._id === active}
      >
        <ConversationsImg
          src={
            user?.profilePicture
              ? `${PF}${user?.profilePicture}`
              : `${PF}person/noAvatar.png`
          }
          alt=""
        />
        <ConversationBox>
          <ConversationName>{user?.username} </ConversationName>
          <ConversationLastMsg>{conversation?.lastMsg} </ConversationLastMsg>
          <ConversationDate>
            {format(conversation?.createdAtMsg)}{" "}
          </ConversationDate>
        </ConversationBox>
        <IconBox
          active={conversation._id === active}
          onClick={() => setMenuItem(true)}
        >
          <Tooltip title="Delete all Messages">
            <DeleteForever
              style={{
                padding: "0px !important",
                margin: "0px !important",
                display: "flex",
                alignItems: "center",
              }}
            />
          </Tooltip>
        </IconBox>
        {menuItem && (
          <ConfirmBox>
            <ConfirmBoxMsg>
              Are you sure to delete this conversation?
            </ConfirmBoxMsg>
            <GrupeButton>
              <ButtonCss
                variant="outlined"
                onClick={() => {
                  deleteConversation(conversation._id);
                }}
              >
                Detele
              </ButtonCss>
              <ButtonCss variant="outlined" onClick={() => setMenuItem(false)}>
                Cancel
              </ButtonCss>
            </GrupeButton>
          </ConfirmBox>
        )}
      </ConversationsContainer>
    )
  );
};

export default Conversations;

const ConversationsContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  margin-top: 20px;
  border-radius: 10px;

  background-color: ${(props) =>
    props.active ? (props) => props.theme.hoverColorPrimary : "none"};
  color: ${(props) => (props.active ? "#ffffff" : "black")};
`;
const ConversationsImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
`;

const ConversationBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ConversationName = styled.span`
  font-weight: 500;
  color: ${(props) => props.theme.tintColorPrimary};
`;

const ConversationLastMsg = styled.span`
  font-size: 14px;
  color: ${(props) => props.theme.tintColorSecondary};
`;

const ConversationDate = styled.span`
  font-size: 9px;
  color: ${(props) => props.theme.tintColorThird};
`;

const IconBox = styled.div`
  justify-self: end;
  margin: auto;
  padding: 8px;
  border-radius: 50%;
  display: ${(props) => (props.active ? "block" : "none")} !important;
  transition: 0.5s background-color;

  &:hover {
    background-color: ${(props) => props.theme.backgroundColorSecondary};
  }
`;

const ConfirmBox = styled.div`
  position: fixed;
  width: 400px;
  height: 120px;
  background-color: ${(props) => props.theme.backgroundColorSecondary};
  color: ${(props) => props.theme.tintColorSecondary};
  border: 1px solid ${(props) => props.theme.grayColor};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 50%;
  left: 50%;
  z-index: 2;
  transform: translate(-50%, -50%);
`;

const ConfirmBoxMsg = styled.p``;
const GrupeButton = styled.div`
  display: flex;
  color: ${(props) => props.theme.tintColorSecondary} !important;
  justify-content: space-around;
  width: 60%;
`;

const ButtonCss = styled(Button)`
  color: ${(props) => props.theme.tintColorSecondary} !important;
  border: 1px solid ${(props) => props.theme.grayColor} !important;
`;
