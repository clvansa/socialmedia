import React from "react";
import styled from "styled-components";
import { IconButton, Tooltip } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";

const FeelingLists = ({ setOpen, setFeeling }) => {
  const feelingListIcon = [
    {
      0: { name: "happy", char: "😀" },
      1: { name: "ok", char: "🙂" },
      2: { name: "ready", char: "😉" },
      3: { name: "shy", char: "😊" },
      4: { name: "blessed", char: "😇" },
      5: { name: "love", char: "😍" },
      6: { name: "kiss", char: "😘" },
      7: { name: "crazy", char: "🤪" },
      9: { name: "silly", char: "😝" },
      10: { name: "rich", char: "🤑" },
      11: { name: "sarcastic", char: "😏" },
      12: { name: "bored", char: "🙄" },
      13: { name: "sad", char: "😔" },
      14: { name: "sleepy", char: "😴" },
      15: { name: "sick", char: "🤕" },
      16: { name: "ill", char: "🤮" },
      17: { name: "angry", char: "🥵" },
      18: { name: "cool", char: "😎" },
      19: { name: "worried", char: "😟" },
      20: { name: "confused", char: "😕" },
    },
  ];

  const handleClick = (icon) => {
    setFeeling(icon);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    setFeeling({});
  };
  return (
    <FeelingListsContainer>
      <FeelingTop>
        <Tooltip title="Cancel feeling" placement="left">
          <IconButton onClick={handleClose}>
            <FeelingArrowBack />
          </IconButton>
        </Tooltip>
        <FeelingTopTitle>How are you feeling?</FeelingTopTitle>
      </FeelingTop>
      <FeelingBottom>
        {feelingListIcon.map((icons) =>
          Object.values(icons).map((icon, i) => (
            <IconInfo key={icon + i} onClick={() => handleClick(icon)}>
              <IconEmoji>{icon.char}</IconEmoji>
              <IconName>{icon.name}</IconName>
            </IconInfo>
          ))
        )}
        <PaddingDiv />
      </FeelingBottom>
    </FeelingListsContainer>
  );
};

export default FeelingLists;

const FeelingListsContainer = styled.div`
  position: absolute;
  width: 30vw;
  height: 50vh;
  bottom: -50;
  left: 50%;
  transform: translate(-50%);
  background-color: ${(props) => props.theme.backgroundColorSecondary};
  z-index: 1000;
  border-radius: 10px;
  -webkit-box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  border: 1px solid ${(props) => props.theme.grayColor};
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background-color: ${(props) => props.theme.hoverColorPrimary};
  }

  ::-webkit-scrollbar-thumb {
    background-color: gray;
  }
`;

const Hline = styled.hr`
  border: none;
  border-bottom: 1px solid ${(props) => props.theme.grayColor};
  margin: 0;
`;

const FeelingTop = styled.div`
  display: flex;
  align-items: center;
  position: sticky;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 100;
  background-color: ${(props) => props.theme.backgroundColor};
  padding: 10px 0;
  border-bottom: 0.4px solid gray;
`;
const FeelingTopTitle = styled.span`
  font-size: 20px;
  color: ${(props) => props.theme.tintColorPrimary};
  justify-items: center;
  margin: auto;
  padding-right: 40px;
`;

const FeelingArrowBack = styled(ArrowBack)`
  color: ${(props) => props.theme.tintColorPrimary};
`;

const FeelingBottom = styled.div`
  height: 100%;
  display: grid;
  padding-top: 10px;
  padding-left: 10px;
  grid-template-columns: 1fr 1fr;
`;
const IconInfo = styled.div`
  width: 180px;
  height: 50px;
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  border-radius: 10px;
  padding: 0 5px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.hoverColorPrimary};
  }
`;
const IconEmoji = styled.span`
  background-color: ${(props) => props.theme.backgroundColor};
  padding: 3px;
  border-radius: 50%;
  font-size: 20px;
`;

const IconName = styled.span`
  padding-left: 5px;
  color: ${(props) => props.theme.tintColorSecondary};
`;

const PaddingDiv = styled.div`
  padding: 5px;
`;
