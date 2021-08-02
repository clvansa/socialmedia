import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { axiosInstance } from "../../util/axiosInstance";
import { Avatar, Button, Tooltip } from "@material-ui/core";
import { format } from "timeago.js";
import MenuListComment from "./MenuListComment";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";

const Comment = ({ comment, userId, delComment, upComment }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [style, setStyle] = useState({ display: "none" });
  const [tag, setTag] = useState("span");
  const [text, setText] = useState("span");
  const { user: currentUser } = useContext(AuthContext);
  const { sendNotificationToSocket } = useContext(SocketContext);
  const [like, setLike] = useState(comment.likes.length);
  const [isLiked, setIsLiked] = useState(
    comment.likes.includes(currentUser._id)
  );

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      setIsLiked(comment.likes.includes(currentUser._id));
    }

    return () => (mounted = false);
  }, [comment]);

  const deleteComment = async () => {
    try {
      const deleteOne = await axiosInstance.delete(
        `/comments/comment/${comment._id}`
      );
      delComment(comment._id);
    } catch (err) {
      console.log(err);
    }
  };

  const editComment = () => {
    setTag("textarea");
  };

  const handleSave = async () => {
    try {
      const res = await axiosInstance.put(`/comments/comment/${comment._id}`, {
        text,
      });
      setTag("span");
      upComment(comment._id, text);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (id) => {
    try {
      const res = await axiosInstance.put(`/comments/${comment._id}/like`);

      const data = {
        receiverId: comment.userId._id,
        postId: comment.postId,
        notifyType: "likeComment",
        sender: currentUser._id,
        createdAt: Date.now(),
      };

      sendNotificationToSocket(data);
      setLike(res.data.like ? like + 1 : like - 1);
    } catch (err) {
      console.log(err);
    }
    setIsLiked(!isLiked);
  };

  return (
    <CommentContainer
      onMouseEnter={() => setStyle({ display: "flex" })}
      onMouseLeave={() => setStyle({ display: "none" })}
    >
      <CommentWrapper>
        <CommentTop>
          <CommentLeft>
            <Avatar
              src={
                comment.userId.profilePicture
                  ? PF + comment.userId?.profilePicture
                  : `${PF}person/noAvatar.png`
              }
            />
          </CommentLeft>
          <CommentRight>
            <CommentBox>
              <CommentName>{comment.userId.username}</CommentName>
              <CommentText
                as={tag}
                defaultValue={comment.text || null}
                onChange={(e) => setText(e.target.value)}
              >
                {tag === "span" ? comment.text : null}
              </CommentText>
              {tag === "textarea" && (
                <div style={{ padding: "10px" }}>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  <Button
                    color="secondary"
                    variant="outlined"
                    onClick={() => setTag("span")}
                  >
                    Cancel
                  </Button>
                </div>
              )}
              <LikeContianer>
                {like > 0 && (
                  <>
                    <Tooltip title={`${like} like this comment`}>
                      <LikeIcon
                        src={isLiked ? `${PF}heart.png` : `${PF}like.png`}
                      />
                    </Tooltip>
                  </>
                )}
              </LikeContianer>
            </CommentBox>
            <CommentRightBottom>
              <CommentLike onClick={() => handleClick(comment._id)}>
                {isLiked ? "UnLike" : "Like"}
              </CommentLike>
              <CommentTime>{format(comment.createdAt)}</CommentTime>
            </CommentRightBottom>
          </CommentRight>
          {userId === comment.userId._id && (
            <CommentOptions style={style}>
              <MenuListComment
                deleteComment={deleteComment}
                editComment={editComment}
              />
            </CommentOptions>
          )}
        </CommentTop>
      </CommentWrapper>
    </CommentContainer>
  );
};

export default Comment;

const CommentContainer = styled.div`
  width: 100%;
  max-width: 620px;
  margin-bottom: 10px;
  position: relative;
  word-break: break-all;
`;
const CommentWrapper = styled.div`
  padding: 5px 5px;
`;

const CommentTop = styled.div`
  display: flex;
  align-items: flex-start;
`;
const CommentLeft = styled.div`
  margin-right: 5px;
`;

const CommentImg = styled.img``;

const CommentRight = styled.div`
  max-width: 400px;
`;

const CommentBox = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.backgroundColor};
  border-radius: 20px;
  padding: 8px 12px;
  position: relative;
`;
const CommentName = styled.span`
  font-size: 13px;
  color: ${(props) => props.theme.tintColorPrimary};
  font-weight: 500;
`;
const CommentText = styled.span`
  font-size: 14px;
  max-width: 350px;
  padding-right: 10px;
  color: ${(props) => props.theme.tintColorSecondary};
`;

const CommentRightBottom = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  margin: 0 8px;
  color: ${(props) => props.theme.grayColor};
`;
const CommentLike = styled.div`
  font-size: 12px;
  cursor: pointer;
`;
const CommentTime = styled.div`
  font-size: 10px;
  margin: 0 5px;
`;

const CommentOptions = styled.div`
  align-self: center;
  margin-bottom: 20px;
  margin-left: 5px;
  border-radius: 50%;
  cursor: pointer;
`;

const LikeContianer = styled.div`
  position: absolute;
  right: -10px;
  bottom: 0;
`;

const LikeIcon = styled.img`
  width: 20px;
  height: 20px;
`;
