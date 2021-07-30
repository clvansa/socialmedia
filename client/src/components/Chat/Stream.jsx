import { useContext } from "react";
import styled from "styled-components";
import { SocketContext } from "../../context/SocketContext";

const Stream = () => {
  return (
    <StreamContainer>
      <h1>Strem</h1>
    </StreamContainer>
  );
};

export default Stream;

const StreamContainer = styled.div`
  width: 500px;
  height: 500px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 1px solid black;
`;
