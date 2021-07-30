import { useEffect, useState } from "react";
import { Paper, Avatar } from "@material-ui/core";
import styled from "styled-components";

const PostSkeleton = ({post}) => {
  const [posts, setPosts] = useState(Array.from({ length: 5 }));

  useEffect(() => {
    setPosts((prevState) => [...post, Array(5)]);
  }, [post]);

  return posts.map((item, index) => (
    <PostConatiner key={index}>
      <PostWrapper>
        <PostTop>
          <PostTopLeft>
            <Avatar />
            <PostInfo>
              <div>
                <PostUsername>username</PostUsername>
              </div>
            </PostInfo>
          </PostTopLeft>
          <PostTopRight></PostTopRight>
        </PostTop>
        <PostCenter>
          <PostText>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus
            pariatur, autem atque vero ex eos alias? Perspiciatis velit dicta
            corporis!
          </PostText>
        </PostCenter>
        <PostBottom>
          <PostBottomLeft>
            <PostBottomLikeIcon />
            <PostBottomLikeIcon />
            <PostLikeCounter>people like it</PostLikeCounter>
          </PostBottomLeft>
          <PostBottomRight>
            <PostCommentText>comments</PostCommentText>
          </PostBottomRight>
        </PostBottom>
      </PostWrapper>
    </PostConatiner>
  ));
};

export default PostSkeleton;

const PostConatiner = styled.div`
  width: 100%;
  max-width: 660px;
  -webkit-box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  margin: auto;
  margin-bottom: 30px;
  border-radius: 10px;
  background-color: white;
  /* min-height: 250px; */

  @media (max-width: 910px) {
    width: 90%;
    margin: 30px auto;
  }
`;
const PostWrapper = styled.div`
  padding: 20px;
`;
const PostTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const PostTopLeft = styled.div`
  display: flex;
  align-items: center;
`;
const PostTopRight = styled.div``;

const PostInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;
const PostUsername = styled.span`
  font-size: 15px;
  font-weight: 500;
  background-color: gray;
  color: gray;
  margin-left: 5px;
`;

const PostCenter = styled.div`
  margin: 20px 0;
`;
const PostText = styled.span`
  background-color: gray;
  width: 100%;
  color: gray;
  padding: 0;
  margin: 0;
`;

const PostBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const PostBottomLeft = styled.div`
  display: flex;
`;
const PostBottomLikeIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 5px;
  cursor: pointer;
  background-color: gray;
`;
const PostLikeCounter = styled.span`
  font-size: 15px;
  color: gray;
  background-color: gray;
`;
const PostBottomRight = styled.div``;
const PostCommentText = styled.span`
  cursor: pointer;
  border-bottom: 1px dashed gray;
  color: gray;
  background-color: gray;
`;
