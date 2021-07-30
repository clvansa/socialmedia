import { useState, useEffect, useContext, useRef, useCallback } from "react";
import Share from "./Share";
import styled from "styled-components";
import Post from "./Post";
import { AuthContext } from "../context/AuthContext";
import { CircularProgress, Paper, Container } from "@material-ui/core";
import PostSkeleton from "./Skeletons/PostSkeleton";
import {axiosInstance} from "../util/axiosInstance"

const Feed = ({ username, video, bookmark }) => {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  const [update, setUpdate] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(true);
  const observer = useRef();


  const lastItem = useCallback(
    (element) => {
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && loadMore) {
            setPage((prevPage) => prevPage + 1);
          }
        },
        { threshold: 1 }
      );

      if (element) {
        observer.current.observe(element);
      }
    },
    [loadMore]
  );

  const updatePost = () => {
    setUpdate(true);
  };

  //Fetch Posts
  useEffect(() => {
    setIsLoading(true);
    const fetchPosts = async () => {
      try {
        const res = video
          ? await axiosInstance.get(`/posts/timeline/video?count=5&page=${page}`)
          : username
          ? await axiosInstance.get(`/posts/profile/${username}?count=5&page=${page}`)
          : bookmark
          ? await axiosInstance.get(`api/posts/timeline/bookmark?count=5&page=${page}`)
          : await axiosInstance.get(`/posts/timeline/post?count=5&page=${page}`);
        if (res.data.length === 0) setLoadMore(false);

        await setPosts((prevPost) => [...prevPost, ...res.data]);
        if (update) {
          setUpdate(false);
          window.location.reload();
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchPosts();
    setIsLoading(false);
  }, [username, user?._id, update, page]);

  const items = posts.map((post, index) => {
    if (posts.length === index + 1) {
      return (
        <div key={post._id} ref={lastItem}>
          <Post post={post} />
          <div style={{ display: "flex", justifyContent: "center" }}>
            {isLoading && <CircularProgress />}
          </div>
        </div>
      );
    } else {
      return (
        <div key={post._id}>
          <Post post={post} update={updatePost} />
        </div>
      );
    }
  });

  return (
    <FeedConatiner>
      <FeedWrapper username={username}>
        {(!username || username === user?.username) && (
          <Share update={updatePost} />
        )}
        {items}
        {/* {isLoading ? <PostSkeleton post={posts}/> : items} */}
      </FeedWrapper>
    </FeedConatiner>
  );
};

export default Feed;

const FeedConatiner = styled.div`
  flex: 6;
  min-width: 680px;

  @media (max-width: 760px) {
    /* padding: 20px 20px; */
    flex: 1;
    min-width: 280px;
    width: 480px;
    /* z-index:100; */
  }
`;

const FeedWrapper = styled.div`
  padding: 20px 100px;
  padding: ${(props) => props.username && "20px 0px"};
  margin-right: ${(props) => props.username && "20px "};

  @media (max-width: 760px) {
    padding: 10px 5px;
    padding-left: 50px;
    min-width: 480px;
  }
  @media (max-width: 600px) {
    padding: 10px 0px;
  }
`;
