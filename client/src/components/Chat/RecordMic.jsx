import { useState, useRef, useContext } from "react";
import axios from "axios";
import { Mic } from "@material-ui/icons";
import { Button, IconButton } from "@material-ui/core";
import styled from "styled-components";
import { SocketContext } from "../../context/SocketContext";

const RecordMic = ({
  conversationId,
  smallChat,
  senderId,
  receiverId,
  setMessages,
}) => {
  const [fileBlob, setFileBlob] = useState(null);
  const [show, setShow] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [chunk, setChunk] = useState([]);
  const { sendMessageToSocket } = useContext(SocketContext);

  let items = [];
  const audioRef = useRef();
  const recorderRef = useRef();

  const handleRecorde = () => {
    setIsRecording(true);
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      recorderRef.current = new MediaRecorder(stream);
      recorderRef.current.ondataavailable = (e) => {
        items.push(e.data);
        setChunk((prevChank) => [...prevChank, e.data]);
        if (recorderRef.current.state === "inactive") {
          let blob = new Blob(items, { type: "audio/webm" });
          audioRef.current.src = URL.createObjectURL(blob);
        }
      };
      recorderRef.current.start(10);
      setTimeout(() => {
        if (recorderRef.current.state === "recording") {
          handleStop();
        }
      }, 30000);
    });
  };

  const handleStop = () => {
    setIsRecording(false);
    setShow(true);
    recorderRef.current.stop();
    recorderRef.current.stream.getTracks().forEach((track) => {
      if (track.readyState == "live") {
        track.stop();
      }
    });
  };

  const handleAudioUpload = async () => {
    let file = await new File([...chunk], "file", {});
    console.log(file);
    setChunk([]);
    items = [];
    const data = await new FormData();
    const fileName = (await Date.now()) + ".webm";
    await data.append("name", fileName);
    await data.append("file", file);

    console.log(data);
    setFileBlob(file);
    try {
      const res = await axios.post("/upload/chat", data, {
        headers: {
          Range: [25, 1626753100061],
        },
      });
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }

    const message = {
      conversationId,
      record: fileName,
    };

    const dataToSocket = {
      senderId,
      receiverId,
      record: fileName,
      isRead: false,
    };

    console.log(dataToSocket);

    sendMessageToSocket(dataToSocket);
    try {
      const res = await axios.post("/message/", message);
      setMessages((prevMessages) => [res.data, ...prevMessages]);
    } catch (err) {
      console.log(err);
    }

    setShow(false);
  };

  const handleCancel = () => {
    setChunk([]);
    // audioRef.current.src = null;
    setShow(false);
  };

  return (
    <Container>
      <SoundReview show={show}>
        <Audio
          ref={audioRef}
          controls={true}
          type="video.webm"
          hidden={!show}
        />
        <ButtonGroup>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={() => handleAudioUpload()}
          >
            Send
          </Button>
          <Button
            onClick={() => handleCancel()}
            variant="outlined"
            color="secondary"
          >
            Cancel
          </Button>
        </ButtonGroup>
      </SoundReview>

      <IconButton
        onClick={isRecording ? handleStop : handleRecorde}
        style={{ padding: smallChat ? 2 : 8 }}
      >
        <CustomMic
          style={{ animation: `${isRecording && "fade"} 1s infinite` }}
        />
      </IconButton>
      {/* 
      <button onClick={() => handleRecorde()}>Start Rec </button>
      <button onClick={() => handleStop()}>stop Rec </button>
      <button onClick={() => handleCancel()}>clear Rec </button>
      <button onClick={() => handleAudioUpload()}>upload Rec </button> */}
      {/* <audio
        src={fileBlob ? URL.createObjectURL(fileBlob) : null}
        controls={true}
        type="video.webm"
      /> */}
    </Container>
  );
};

const Container = styled.div``;

const SoundReview = styled.div`
  display: ${(props) => (props.show ? "flex" : "none")};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 120px;
  left: 0;
  background-color: ${(props) => props.theme.backgroundColorSecondary};
  border: 1px solid ${(props) => props.theme.grayColor};
  height: 150px;
  width: 300px;
  -webkit-box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  border-radius: 10px;
`;

const ButtonGroup = styled.div`
  padding-top: 10px;
  display: flex;
  justify-content: space-around;
  width: 70%;
`;
const CustomMic = styled(Mic)`
  color: ${(props) => props.theme.tintColorPrimary};
`;

const Audio = styled.audio`
  width: 250px;
`;

export default RecordMic;
