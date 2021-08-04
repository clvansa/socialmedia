import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../util/axiosInstance";

const UserFollowings = ({ user, setValue }) => {
  const [friends, setFriends] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    if (!user?._id) return;
    const getFriends = async () => {
      try {
        const friendList = await axiosInstance.get(
          `/users/friends/${user?._id}`
        );
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
    return () => friends;
  }, [user]);

  return (
    <UserFollowingsContainer>
      <UserFollowingsWrapper>
        <RightbarTitle style={{ marginBottom: 10 }} onClick={() => setValue(2)}>
          Followings: {friends.length} friends
        </RightbarTitle>
        {/* //Follwings */}
        <RightbarFollowings>
          {friends.map((friend) => (
            <RightbarFollowing key={friend._id}>
              <Link
                to={`/profile/${friend.username}`}
                onClick={() =>
                  (window.location.href = `/profile/${friend.username}`)
                }
              >
                <RightbarFollowingContianer>
                  <RightbarFollowingImage
                    src={friend?.profilePicture}
                    alt="follower"
                  />
                  <RightbarFollowingName>
                    {friend.username}
                  </RightbarFollowingName>
                </RightbarFollowingContianer>
              </Link>
            </RightbarFollowing>
          ))}
        </RightbarFollowings>
      </UserFollowingsWrapper>
    </UserFollowingsContainer>
  );
};

export default UserFollowings;

const UserFollowingsContainer = styled.div`
  -webkit-box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  height: 450px;
  width: 100%;
  margin-top: 20px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.backgroundColorSecondary};
  overflow: hidden;
`;

const UserFollowingsWrapper = styled.div`
  padding: 10px;
`;

const RightbarFollowings = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const RightbarTitle = styled.h4`
  font-size: 18px;
  font-weight: 500;
  margin: 0;
  cursor: pointer;
  color: ${(props) => props.theme.tintColorSecondary};
`;

const RightbarFollowing = styled.div``;

const RightbarFollowingContianer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  cursor: pointer;
  width: 80px;
  margin: 5px;
  overflow: hidden;
`;
const RightbarFollowingImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 10%;
  object-fit: cover;
`;

const RightbarFollowingName = styled.span`
  color: ${(props) => props.theme.tintColorSecondary};
  font-size: 14px;
`;
