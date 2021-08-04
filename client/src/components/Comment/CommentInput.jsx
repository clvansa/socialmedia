import React, { useState, useContext } from "react";
import styled from "styled-components";
import { SocketContext } from "../../context/SocketContext";
import { axiosInstance } from "../../util/axiosInstance";
import Emoji from "../Chat/Emoji";

const CommentInput = ({ user, postId, setComments, hasComment }) => {
  const [comment, setComment] = useState("");
  const { sendNotificationToSocket } = useContext(SocketContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    if (e.key === "Enter") {
      const newComment = {
        userId: user._id,
        postId,
        text: comment,
      };
      try {
        const res = await axiosInstance.post("/comments/", newComment);
        setComments((prevState) => [res.data, ...prevState]);
        setComment("");
        const post = await axiosInstance.get(`/posts/${postId}`);
        console.log(post);
        const data = {
          receiverId: post.data.userId,
          notifyType: "comment",
          createdAt: Date.now(),
        };

        console.log(data);

        sendNotificationToSocket(data);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <CommentInputContainer hasComment={hasComment}>
      <CommentInputWarpper>
        <CommentInputBox>
          <CommentImg src={user.profilePicture} />
          <InputContainer>
            <InputComment
              placeholder="Write a comment..."
              onChange={handleChange}
              onKeyDown={handleSubmit}
              value={comment}
            />
            {/* <EmojiEmotionsOutlined style={{ color: "white" }} /> */}
            <div style={{ position: "relative" }}>
              <Emoji setData={setComment} />
            </div>
          </InputContainer>
        </CommentInputBox>
      </CommentInputWarpper>
    </CommentInputContainer>
  );
};

export default CommentInput;

const CommentInputContainer = styled.div`
  border-bottom: ${(props) =>
    props.hasComment && `1px solid  ${props.theme.grayColor}`};
`;
const CommentInputWarpper = styled.div`
  padding: 10px 10px 10px 10px;
`;
const CommentInputBox = styled.div`
  display: flex;
  align-items: center;
`;
const CommentImg = styled.img`
  width: 36px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const InputContainer = styled.div`
  border-radius: 20px;
  background-color: ${(props) => props.theme.inputBackgroundColor};
  width: 100%;
  display: flex;
  align-items: center;
  height: 35px;
  padding: 0 10px;
  margin: 0 5px;
  /* -webkit-box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68); */
`;
const InputComment = styled.input`
  background-color: inherit;
  border: none;
  color: ${(props) => props.theme.tintColorSecondary};
  width: 100%;
  &::placeholder {
    color: ${(props) => props.theme.tintColorSecondary};
  }
  &:focus {
    outline: none;
  }
`;
