import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SuggestedCarousel from "./SuggestedCarousel";
import axios from "axios";

const SuggestedFriends = () => {
  const [suggestedFriends, setSuggestedFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const res = await axios.get(`/users/suggestedfriends`);
        setSuggestedFriends(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, []);

  return (
    <SuggestedFriendsContainer>
      <SuggestedFriendsWrapper>
        <SuggestedCarousel suggestedFriends={suggestedFriends} />
      </SuggestedFriendsWrapper>
    </SuggestedFriendsContainer>
  );
};

export default SuggestedFriends;

const SuggestedFriendsContainer = styled.div`
  height: 180px;
  flex: 0 0 100%;
  margin: auto;
  background-color: ${(props) => props.theme.backgroundColorSecondary};
  border-radius: 10px;
  overflow: auto;
  max-width: 1030px;
  -webkit-box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  @media (max-width: 1036px) {
    display: none;
  }
`;
const SuggestedFriendsWrapper = styled.div`
  box-sizing: border-box;
  padding: 20px 50px;

  height: 100%;
  border-radius: 10px;

  /* width: 100%; */
`;
