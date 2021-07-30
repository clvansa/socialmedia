import React, { useContext } from "react";
import { SocketContext } from "../../context/SocketContext";
import { AuthContext } from "../../context/AuthContext";
import styled from "styled-components";
import { Button } from "@material-ui/core";

const VideoPlayer = () => {
  const {
    name,
    callAccepted,
    myVideo,
    userVideo,
    callEnded,
    stream,
    call,
    leaveCall,
    callRecipient
  } = useContext(SocketContext);

  const { user } = useContext(AuthContext);

  const findUser = () => {};

  return callAccepted || stream ? (
    <VideoContainer>
      <VideoWarpper>
        <VideoTop>You call {callRecipient.username}</VideoTop>
        {stream && (
          <div>
            <audio
              playsInline
              ref={myVideo}
              // muted
              controls={true}
              autoPlay
              hidden
            />
          </div>
        )}

        {callAccepted && !callEnded && (
          <div>
            <Video
              playsInline
              ref={userVideo}
              autoPlay
              controls={true}
              id="userVideo"
            />
          </div>
        )}
        <Button onClick={() => leaveCall(user._id)} variant="outlined" color="secondary">
          Hang up
        </Button>
      </VideoWarpper>
    </VideoContainer>
  ) : null;
};

export default VideoPlayer;

const VideoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 150px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  -webkit-box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  z-index: 1000;

  background-color: ${(props) => props.theme.backgroundColorSecondary};
  color: ${(props) => props.theme.tintColorSecondary};
`;

const VideoWarpper = styled.div`
  padding: 10px;
`;

const VideoTop = styled.div`
  padding: 10px 0;
`;

const Video = styled.audio`
  filter: sepia(20%) saturate(70%) grayscale(1) contrast(99%) invert(12%);
  width: 200px;
  height: 25px;
  background-color: transparent;

  &::-webkit-media-controls-panel {
    background-color: transparent;
  }

  &&::-webkit-media-controls-play-button {
    display: none;
  }
`;
