import { useState, useEffect } from "react";
import styled from "styled-components";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Users } from "../../dummyData";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 9,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 6,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const SuggestedCarousel = ({ suggestedFriends }) => {
  const [suggested, setSuggested] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  //Shuffle users
  useEffect(() => {
    setSuggested(suggestedFriends.sort(() => Math.random() - 0.5));
    console.log(suggestedFriends);
  }, [suggestedFriends]);

  return (
    <Carousel
      responsive={responsive}
      swipeable={true}
      draggable={false}
      infinite={false}
    >
      {suggested ? (
        suggested.map((friend) => (
          <Card
            key={friend._id}
            onClick={() =>
              (window.location.href = `/profile/${friend.username}`)
            }
          >
            <CardImg
              src={
                friend.profilePicture
                  ? `${PF}${friend.profilePicture}`
                  : `${PF}person/noAvatar.png`
              }
            />
            <CardName>{friend.username}</CardName>
          </Card>
        ))
      ) : (
        <p>Loading</p>
      )}
    </Carousel>
  );
};

export default SuggestedCarousel;


const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  cursor: pointer;
`;
const CardImg = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 20px;
  object-fit: cover;
`;
const CardName = styled.p`
  text-align: center;
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: block;
  color: ${(props) => props.theme.tintColorSecondary};
  font-size: 14px;
`;
