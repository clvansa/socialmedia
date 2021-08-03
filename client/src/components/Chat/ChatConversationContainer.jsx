import { useState, useEffect } from "react";
import { ArrowForward, ArrowBack, Menu } from "@material-ui/icons";
import styled from "styled-components";
import { IconButton } from "@material-ui/core";
import useWindowsSize from "../../util/useWindowsSize";
import ChatMessagerConversation from "./ChatMessagerConversation";

const ChatConversationContainer = ({ user, setCurrentChat, currentChat }) => {
  const [view, setView] = useState(true);
  const [position, setPosition] = useState("sticky");
  const size = useWindowsSize();

  const handleToggle = () => {
    setView(!view);
  };

  useEffect(() => {
    if (size.width <= 1000) {
      setView(false);
      setPosition("fixed");
    } else {
      setPosition("sticky");
      setView(true);
    }
  }, [size]);

  const checkSize = () => {
    if (size.width > 400) {
      return "400px";
    } else {
      return "300px";
    }
  };
  return (
    <Contianer style={{ position }}>
      <SidebarWrapper>
        <CustomIconButton onClick={handleToggle}>
          {size.width > 600 ? (
            view ? (
              <ArrowBackCss />
            ) : (
              <ArrowForwardCss />
            )
          ) : (
            <IconContianer view={view}>
              <Menu />
            </IconContianer>
          )}
        </CustomIconButton>
        <SidebarContent style={{ width: view ? checkSize() : "0" }}>
          <ChatMessagerConversation
            user={user}
            setCurrentChat={setCurrentChat}
            currentChat={currentChat}
          />
        </SidebarContent>
      </SidebarWrapper>
    </Contianer>
  );
};

export default ChatConversationContainer;

const Contianer = styled.div`
  min-width: 50px;
  background-color: ${(props) => props.theme.backgroundColor};
  z-index: 100;
  height: calc(100vh - 51px);
  top: 50px;

  @media (max-width: 600px) {
    top: 0px;
    z-index: 10000;
    background-color: transparent;
  }
`;
const SidebarWrapper = styled.div`
  position: relative;
`;

const CustomIconButton = styled(IconButton)`
  position: absolute !important;
  right: 0px;
  top: 0px;
  z-index: 2000;
  @media (max-width: 600px) {
    right: 10px;
    top: 1px;
  }
`;

const SidebarContent = styled.div`
  padding-top: 20px;
  transition: 0.5s;
  @media (max-width: 600px) {
    top: 0px;
    z-index: 50000;
    background-color: ${(props) => props.theme.backgroundColor};
    height: 100vh;
  }
`;

const ArrowForwardCss = styled(ArrowForward)`
  color: ${(props) => props.theme.tintColorPrimary};
`;
const ArrowBackCss = styled(ArrowBack)`
  color: ${(props) => props.theme.tintColorPrimary};
`;
const IconContianer = styled.div`
  color: ${(props) => props.theme.tintColorPrimary};
`;
