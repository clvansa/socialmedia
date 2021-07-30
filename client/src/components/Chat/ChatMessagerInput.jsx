import React from "react";
import styled from "styled-components";

const ChatMessagerInput = ({
  setNewMessage,
  handleSendMsg,
  newMessage,
  inputRef,
  onFocus,
}) => {
  return (
    <>
      <ChatMessageInput
        placeholder="Write a message"
        onChange={(e) => setNewMessage(e.target.value)}
        value={newMessage}
        ref={inputRef}
        onFocus={onFocus}
      />
      <ChatSubmitButton
        type="submit"
        onClick={handleSendMsg}
        disabled={newMessage === "" && true}
      >
        send
      </ChatSubmitButton>
    </>
  );
};

export default ChatMessagerInput;

const ChatMessageInput = styled.textarea`
  width: 75%;
  height: 90px;
  padding: 10px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.inputBackgroundColor};
  border: 1px solid ${(props) => props.theme.grayColor};
  color: ${(props) => props.theme.tintColorPrimary};
  border-radius: 10px;

  &:focus {
    outline: none;
  }
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
