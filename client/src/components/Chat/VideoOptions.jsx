import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { SocketContext } from "../../context/SocketContext";
import { Call, CallEnd } from "@material-ui/icons";
import { AuthContext } from "../../context/AuthContext";

const VideoOptions = ({ currentFriend }) => {
  const {
    me,
    callAccepted,
    name,
    setName,
    callEnded,
    leaveCall,
    callUser,
    setVideoUsersId,
    videoUsersId,
    setCallRecipient,
  } = useContext(SocketContext);
  const { user } = useContext(AuthContext);

  const getUserSocketId = () => {
    const socketId = videoUsersId.find(
      (user) => user.userId === currentFriend?._id
    );
    if (socketId) {
      return socketId.socketId;
    } else {
      return null;
    }
  };

  const handleClick = () => {
    setName(user?.username);
    setCallRecipient({
      _id: currentFriend._id,
      username: currentFriend.username,
      profilePicture: currentFriend.profilePicture,
    });
    callUser(getUserSocketId());
  };
  return (
    <VideoOptionsContainer>
      {callAccepted && !callEnded ? (
        <CallEnd onClick={leaveCall} color="secondary" />
      ) : (
        <CallIcon onClick={handleClick} />
      )}
    </VideoOptionsContainer>
  );
};

export default VideoOptions;

const VideoOptionsContainer = styled.div`
  font-size: 0 !important;
`;

const CallIcon = styled(Call)`
  color: ${(props) => props.theme.tintColorPrimary};
`;
