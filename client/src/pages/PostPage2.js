import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation, useHistory } from 'react-router-dom';
import styled from "styled-components";
import {axiosInstance} from "../util/axiosInstance";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ReactPlayer from "react-player";
import ShowMoreText from "react-show-more-text";
import PostMenuItems from "../components/PostMenuItems";
import Topbar from "../components/Header/Topbar";
import { SocketContext } from "../context/SocketContext";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import { IconButton, Tooltip, Button } from "@material-ui/core";
import Comments from "../components/Comment/Comments";




const PostPage = (props) => {
    const postId = props.match.params.id
    const history = useHistory();
    const [like, setLike] = useState(0);
    const [post, setPost] = useState({})
    const [user, setUser] = useState([]);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user: currentUser } = useContext(AuthContext);
    const { sendNotificationToSocket } = useContext(SocketContext);
    const [isLiked, setIsLiked] = useState(false);
    const [bookmark, setBookmark] = useState(false);
    const [showComments, setShowComments] = useState(false);


    useEffect(() => {
        let mounted = true;
        const getPost = async () => {
            try {
                const res = await axiosInstance.get(`/posts/${postId}`)
                const resUser = await axiosInstance.get(`/users/user?userId=${res.data.userId}`)

                if (mounted) {
                    setPost(res.data)
                    setIsLiked(res.data.likes.includes(currentUser._id))
                    setLike(res.data.likes.length)
                    setUser(resUser.data)
                }

            } catch (err) {
                console.log(err)
                history.push('/notfound')
            }
        }
        getPost();
        return () => mounted = false;
    }, [postId])


    const likeHandler = async () => {
        try {
            const res = await axiosInstance.put(`/posts/${post._id}/like`);
            if (res.data.like) {
                //Check
                const data = {
                    receiverId: user._id,
                    postId: post._id,
                    notifyType: "like",
                    createdAt: Date.now(),
                };
                sendNotificationToSocket(data)
            }
            setLike(res.data.like ? like + 1 : like - 1); //Check
        } catch (err) {
            console.log(err);
        }
        setIsLiked(!isLiked);
    };

    const handleSavePost = async () => {
        try {
            await axiosInstance.put(`/posts/bookmark/post/${post._id}`);
            setBookmark((prevBookMark) => !prevBookMark);
        } catch (err) {
            console.log(err);
        }
    };


    return (
        <div>
            <Topbar />
            <Container>

                <ContainerLeft>
                </ContainerLeft>
                <ContainerCenter>
                    <CustomButton onClick={() => history.goBack()}>Back</CustomButton>
                    <PostConatiner>
                        <PostWrapper>
                            <PostTop>
                                <PostTopLeft>
                                    <Link to={`/profile/${user.username}`}>
                                        <PostProfileImage
                                            src={
                                                user?.profilePicture
                                                    ? PF + user?.profilePicture
                                                    : PF + "person/noAvatar.png"
                                            }
                                        />
                                    </Link>
                                    <PostInfo>
                                        <div>
                                            <Link to={`/profile/${user.username}`}>
                                                <PostUsername>{user?.username}</PostUsername>
                                            </Link>
                                            {post.feeling && (
                                                <PostFeeling>
                                                    is
                                                    <span style={{ fontSize: "14px", padding: "1px" }}>
                                                        {post.feeling.char}
                                                    </span>
                                                    feeling {post.feeling.name}.
                                                </PostFeeling>
                                            )}
                                            <Link
                                                style={{ display: "inline-block" }}
                                                to={{
                                                    pathname: `/post/${post._id}`,
                                                    state: { tag: post?.location },
                                                }}
                                            >
                                                <PostLocation>{post?.location}</PostLocation>
                                            </Link>
                                        </div>

                                        <div>
                                            <PostDate>{format(post.createdAt)}</PostDate>
                                            <PostDate title={post?.lastEdit && format(post?.lastEdit)}>
                                                {post?.lastEdit && " Edited"}
                                            </PostDate>
                                        </div>
                                    </PostInfo>
                                </PostTopLeft>
                                <PostTopRight>
                                    {currentUser?._id === post.userId ? (
                                        <PostMenuItems
                                            post={post}
                                            userId={currentUser?._id}
                                        />
                                    ) : (
                                        <Tooltip
                                            title={
                                                bookmark
                                                    ? "Delete post from bookmark"
                                                    : "Save post to bookmark"
                                            }
                                        >
                                            <IconButton onClick={() => handleSavePost()}>
                                                {bookmark ? (
                                                    <BookmarkIcon style={{ color: "orange" }} />
                                                ) : (
                                                    <BookmarkBorder />
                                                )}
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </PostTopRight>
                            </PostTop>
                            <PostCenter>
                                <ShowMoreTextCss
                                    lines={3}
                                    more="Show more"
                                    less="Show less"
                                    className="content-css"
                                    anchorClass="my-anchor-css-class"
                                    expanded={false}
                                >
                                    <PostText>{post?.desc}</PostText>
                                </ShowMoreTextCss>
                                <PostImage src={post.img && PF + "post/" + post.img} alt="" />
                                {post?.video && (
                                    <ReactPlayer
                                        url={post.video && PF + "post/" + post.video}
                                        controls={true}
                                        width={"100%"}
                                        playing={true}
                                    />
                                )}
                            </PostCenter>
                            <PostBottom>
                                <PostBottomLeft>
                                    <PostBottomLikeIcon src={`${PF}like.png`} onClick={likeHandler} />
                                    <PostBottomLikeIcon src={`${PF}heart.png`} />
                                    <PostLikeCounter>
                                        {isLiked && "You and"} {isLiked ? like - 1 : like} people like it
                                    </PostLikeCounter>
                                </PostBottomLeft>
                                <PostBottomRight>
                                    <PostCommentText onClick={() => setShowComments(true)}>
                                        {post.comment} comments
                                    </PostCommentText>                                </PostBottomRight>
                            </PostBottom>
                        </PostWrapper>
                        {showComments && <Comments postId={post._id} user={currentUser} />}
                    </PostConatiner>
                </ContainerCenter>
                <ContainerRight>
                </ContainerRight>


            </Container>
        </div>
    )
}

export default PostPage;
const Container = styled.div`
    display:flex;
    background-color: ${props => props.theme.backgroundColor};
    min-height: calc(100vh - 51px);
`
const ContainerLeft = styled.div`
    flex: 3.5;
`

const CustomButton = styled(Button)`
    color:${props => props.theme.tintColorSecondary} !important;
`
const ContainerCenter = styled.div`
    flex: 5;
    min-width: 480px;
`
const ContainerRight = styled.div`
flex: 3.5;
`
const PostConatiner = styled.div`
  width: 100%;
  -webkit-box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  margin: 30px 0;
  border-radius: 10px;
  background-color: ${props => props.theme.backgroundColorSecondary};
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
const PostProfileImage = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 5px;
  margin-top: 5px;
`;

const PostInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;
const PostUsername = styled.span`
  font-size: 15px;
  font-weight: 500;
  /* margin: 0 5px; */
  color:${props => props.theme.tintColorPrimary};
`;

const PostFeeling = styled.span`
  padding-left: 5px;
  font-size: 13px;
  color: ${(props) => props.theme.tintColorSecondary};
`;

const PostDate = styled.span`
  font-size: 10px;
  color: gray;
  color:${props => props.theme.tintColorSecondary};
`;

const PostLocation = styled.span`
  font-size: 13px;
  color: darkgray;
  padding-left: 10px;
  color:${props => props.theme.tintColorSecondary};
`;
const PostCenter = styled.div`
  margin: 20px 0;
`;

const ShowMoreTextCss = styled(ShowMoreText)`
  color: ${(props) => props.theme.tintColorPrimary} ;
`
const PostText = styled.span``;
const PostImage = styled.img`
  margin-top: 20px;
  width: 100%;
  max-height: 500px;
  object-fit: contain;
`;

const PostBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color:${props => props.theme.tintColorPrimary};
`;
const PostBottomLeft = styled.div`
  display: flex;
`;
const PostBottomLikeIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 5px;
  cursor: pointer;
`;
const PostLikeCounter = styled.span`
  font-size: 15px;
`;
const PostBottomRight = styled.div`
`;
const PostCommentText = styled.span`
  cursor: pointer;
  border-bottom: 1px dashed gray;
`;

const BookmarkBorder = styled(BookmarkBorderIcon)`
  color: ${(props) => props.theme.tintColorSecondary} ;
`