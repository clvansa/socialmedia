import React, { useContext } from "react";
import styled from "styled-components";
import Moment from "moment";
import {
  Home,
  School,
  Work,
  Cake,
  Wc,
  LocationCity,
  People,
} from "@material-ui/icons";

const UserInfoRightbar = ({ user, setValue }) => {
  const Relationship =
    user?.relationship === 1
      ? "Single"
      : user?.relationship === 2
      ? "Married"
      : user?.relationship === 3
      ? "Complicated"
      : "";

  const Gender =
    user?.gender === 1
      ? "Male"
      : user?.gender === 2
      ? "Female"
      : user?.gender === 3
      ? "Non-binary"
      : "";

  const getValue = (value) => {
    if (value === "relationship") {
      return Relationship;
    } else if (value === "gender") {
      return Gender;
    } else if (value === "birthday") {
      return Moment(user.birthday).format("DD/MM/YY");
    } else {
      return user?.[value];
    }
  };

  const getKeys = (value, color) => {
    if (value === "from") {
      return <Home color={color} />;
    } else if (value === "city") {
      return <LocationCity color={color} />;
    } else if (value === "work") {
      return <Work color={color} />;
    } else if (value === "study") {
      return <School color={color} />;
    } else if (value === "relationship") {
      return <Wc color={color} />;
    } else if (value === "birthday") {
      return <Cake color={color} />;
    } else if (value === "gender") {
      return <People color={color} />;
    }
  };
  return (
    <UserInfoContainer>
      <UserInfoWrapper>
        <div style={{ display: "flex", alignItems: "center" }}>
          <RightbarTitle onClick={() => setValue(1)}>About </RightbarTitle>
        </div>
        <RightbarInfo>
          {user?.userInfo?.map((info, index) => {
            return (
              <RightbarInfoItem key={index}>
                <RightbarInfoKey>
                  <InfoKeyIcon>{getKeys(info, "error")}</InfoKeyIcon>

                  <InfoKeyName> {info}:</InfoKeyName>
                </RightbarInfoKey>

                <RightbarInfoValue>{getValue(info)}</RightbarInfoValue>
              </RightbarInfoItem>
            );
          })}
        </RightbarInfo>
      </UserInfoWrapper>
    </UserInfoContainer>
  );
};

export default UserInfoRightbar;

const UserInfoContainer = styled.div`
  -webkit-box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  min-height: 250px;
  width: 100%;
  /* margin-top: 20px; */
  border-radius: 10px;
  background-color: ${(props) => props.theme.backgroundColorSecondary};
`;
const UserInfoWrapper = styled.div`
  padding: 20px;
`;

const RightbarTitle = styled.h4`
  font-size: 18px;
  font-weight: 500;
  margin: 0;
  margin-bottom: 5px;
  cursor: pointer;
  color: ${(props) => props.theme.tintColorSecondary};
`;

const RightbarInfo = styled.div`
  margin-bottom: 30px;
`;
const RightbarInfoItem = styled.div`
  margin-bottom: 5px;
  display: flex;
  align-items: center;
`;
const RightbarInfoKey = styled.span`
  font-weight: 500;
  margin-right: 10px;
  color: #555;
  text-transform: capitalize;
  padding: 0;
  display: flex;
  align-items: center;
`;

const InfoKeyIcon = styled.span`
  padding-right: 5px;
`;
const InfoKeyName = styled.span``;

const RightbarInfoValue = styled.span`
  font-weight: 300;
  font-size: 14px;
  line-height: 1.5rem;
  color: ${(props) => props.theme.tintColorPrimary};
`;
