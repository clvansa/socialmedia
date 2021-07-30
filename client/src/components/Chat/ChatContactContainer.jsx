import { useState, useEffect } from "react";
import styled from "styled-components";
import { ArrowForward, ArrowBack, Menu } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import useWindowsSize from "../../util/useWindowsSize";
import ChatOnlineUser from "./ChatOnlineUser";

const ChatContactContainer = ({ setCurrentChat, currentUserId }) => {
  const [view, setView] = useState(true);
  const [position, setPosition] = useState("sticky");
  const [findFirend, setFindFriend] = useState("");
  const size = useWindowsSize();

  const handleToggle = () => {
    setView(!view);
  };

  useEffect(() => {
    if (size.width <= 1400) {
      setView(false);
      setPosition("fixed");
    } else {
      setView(true);
      setPosition("sticky");
    }
  }, [size]);
  console.log(view);

  const handleChange = (e) => {
    return setFindFriend(e.target.value);
  };

  return (
    <Contianer style={{ position }}>
      <ChatContactWrapper>
        <TitleBox>
          <SearchFriend
            placeholder="Search for contacts"
            onChange={handleChange}
          />
        </TitleBox>

        <CustomIconButton onClick={handleToggle}>
          {view ? <ArrowBackCss /> : <ArrowForwardCss />}
        </CustomIconButton>
        <ChatContactContent style={{ width: view ? "400px" : "0px" }}>
          <ChatOnlineUser
            setCurrentChat={setCurrentChat}
            currentUserId={currentUserId}
            filterFriend={findFirend}
          />
        </ChatContactContent>
      </ChatContactWrapper>
    </Contianer>
  );
};

export default ChatContactContainer;

const Contianer = styled.div`
  min-width: 50px;
  right: 0;
  background-color: ${(props) => props.theme.backgroundColor};
  z-index: 100;
  height: calc(100vh - 51px);
  top: 50px;

  /* @media (max-width: 600px) {
    top: 0px;
    z-index: 10000;
    background-color: transparent;
  } */
`;
const ChatContactWrapper = styled.div`
  position: relative;
`;

const CustomIconButton = styled(IconButton)`
  position: absolute !important;
  left: 0px;
  top: 0px;
  z-index: 2000;
  /* @media (max-width: 600px) {
    right: 10px;
    top: 1px;
  } */
`;

const ChatContactContent = styled.div`
  padding-top: 20px;
  transition: 0.5s;
  /* @media (max-width: 600px) {
    top: 0px;
    z-index: 50000;
    background-color: ${(props) => props.theme.backgroundColor};
    height: 100vh;
  } */
`;

const ArrowForwardCss = styled(ArrowForward)`
  color: ${(props) => props.theme.tintColorPrimary};
`;
const ArrowBackCss = styled(ArrowBack)`
  color: ${(props) => props.theme.tintColorPrimary};
`;

const TitleBox = styled.div`
  position: absolute;
  top: 10px;
  left: 180px;
  transform: translate(-50%);
  color: ${(props) => props.theme.tintColorPrimary};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;


const SearchFriend = styled.input`
  background-color: ${(props) => props.theme.inputBackgroundColor};
  border: 1px solid ${(props) => props.theme.grayColor};
  color: ${(props) => props.theme.tintColorSecondary};
  border-radius: 20px;
  padding-left: 10px;
  height: 25px;
  width: 250px;
  margin-left: 10px;

  &:focus {
    outline: none;
  }
`;
