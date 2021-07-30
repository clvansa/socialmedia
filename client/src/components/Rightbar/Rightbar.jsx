import { useState } from "react";
import styled from "styled-components";
import { Close } from "@material-ui/icons";
import CardCarousel from "./advertisement/CardCarousel";

const Rightbar = () => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [birthdayFriend, setBirthdayFriend] = useState(false);

  const HomeRightbar = () => {
    return (
      <>
        <BirthdayContainer
          style={{ display: birthdayFriend ? "none" : "flex" }}
        >
          <BirthdayImage src={`${PF}gift.png`} alt="Birthday" />
          <BirthdayText>
            <b>Pola Foster</b> and <b>3 other friend</b> hava a birthday today
          </BirthdayText>
          <CloseIcon onClick={() => setBirthdayFriend(true)} />
        </BirthdayContainer>
        <RightbarAd>
          <CardCarousel />
        </RightbarAd>
      </>
    );
  };

  return (
    <RightbarContainer>
      <RightbarWrapper>{HomeRightbar()}</RightbarWrapper>
    </RightbarContainer>
  );
};

export default Rightbar;

const RightbarContainer = styled.div`
  flex: 2.5;
  position: sticky;
  top: 50px;
  height: calc(100vh - 51px);

  
  @media (max-width: 1000px) {
    display: none;
  }
`;
const RightbarWrapper = styled.div`
  padding: 20px 20px 0 0;
`;

const BirthdayContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  max-width: 300px;
  @media (max-width: 1900px) {
    display: none;
  }
`;
const CloseIcon = styled(Close)`
  position: absolute;
  top: 0px;
  right: 0;
  font-size: 16px !important;
  color: whitesmoke;
  background-color: gray;
  border-radius: 50%;
  padding: 1px;
`;
const BirthdayImage = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 10px;
`;
const BirthdayText = styled.span`
  font-weight: 300;
  font-size: 15px;
  color: ${(props) => props.theme.tintColorSecondary};
`;

const RightbarAd = styled.div`
  border-radius: 10px;
  height: 300px;

  @media (max-width: 1700px) {
    width: 150px !important;
  }

  @media (max-width: 1200px) {
    width: 150px;
    height: 250px;
  }
  @media (max-width: 910px) {
    display: none;
  }
`;
