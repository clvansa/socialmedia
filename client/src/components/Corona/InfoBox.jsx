import { CardContent, Typography } from "@material-ui/core";
import styled from "styled-components";

const InfoBox = ({ title, cases, total, isRed, active, ...props }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <InfoBoxContainer onClick={props.onClick} active={active} isRed={isRed}>
      <InfoBoxImg src={`${PF}corona/${title.toLowerCase()}.png`} />
      <CardContent>
        <TypographyCss>{title}</TypographyCss>
        <Cases isRed={isRed}>{cases}</Cases>
        <TypographyCss>{total} Total</TypographyCss>
      </CardContent>
    </InfoBoxContainer>
  );
};

export default InfoBox;

const InfoBoxContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  cursor: pointer;
  min-width: 200px;
  max-height: 180px;
  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 2px;
    top: 0;
    left: 0;
    border-top: ${(props) => props.active && "inset 10px  greenyellow"};
    border-top: ${(props) =>
      props.active && props.isRed && "inset 10px  #e9405f"};
  }
  color: #e9405f;
  &:nth-child(2) {
    color: lightgreen !important;
  }

  @media (max-width: 810px) {
    min-width: 100px;
    max-height: 180px;
  }
`;

const TypographyCss = styled(Typography)`
  background-color: ${(props) => props.theme.backgroundColorSecondary};
  color: ${(props) => props.theme.tintColorSecondary};
`;

const InfoBoxImg = styled.img`
  width: 60px;
  height: 60px;

  @media (max-width: 810px) {
    width: 30px;
    height: 30px;
  }
`;

const Cases = styled.h2`
  margin: 0;
  font-weight: 600;

  @media (max-width: 810px) {
    font-size: 16px;
  }
`;
