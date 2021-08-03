import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { AuthContext } from "../../context/AuthContext";
import Moment from "moment";
import FormDialog from "./FormDialog";
import DisplayAboutUser from "./DisplayAboutUser";

const AboutProfile = ({ user, setValue }) => {
  const { user: currentUser } = useContext(AuthContext);

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

  return (
    <AboutProfileContainer>
      <AboutProfileWrapper>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <RightbarTitle>About </RightbarTitle>
          {currentUser?._id === user?._id && (
            <RightbarTopRight>
              <FormDialog user={user} />
              <DisplayAboutUser user={currentUser} />
            </RightbarTopRight>
          )}
        </div>
        <RightbarInfo>
          <RightbarInfoItem>
            <RightbarInfoKey>City:</RightbarInfoKey>
            <RightbarInfoValue>{user.city}</RightbarInfoValue>
          </RightbarInfoItem>

          <RightbarInfoItem>
            <RightbarInfoKey>From:</RightbarInfoKey>
            <RightbarInfoValue>{user.from}</RightbarInfoValue>
          </RightbarInfoItem>

          <RightbarInfoItem>
            <RightbarInfoKey>Relationship:</RightbarInfoKey>
            <RightbarInfoValue>{Relationship}</RightbarInfoValue>
          </RightbarInfoItem>

          <RightbarInfoItem>
            <RightbarInfoKey>Gender:</RightbarInfoKey>
            <RightbarInfoValue>{Gender}</RightbarInfoValue>
          </RightbarInfoItem>

          <RightbarInfoItem>
            <RightbarInfoKey>Birthday:</RightbarInfoKey>
            <RightbarInfoValue>
              {user.birthday && Moment(user.birthday).format("DD/MM/YY")}
            </RightbarInfoValue>
          </RightbarInfoItem>

          <RightbarInfoItem>
            <RightbarInfoKey>Work:</RightbarInfoKey>
            <RightbarInfoValue>{user.work}</RightbarInfoValue>
          </RightbarInfoItem>

          <RightbarInfoItem>
            <RightbarInfoKey>Study:</RightbarInfoKey>
            <RightbarInfoValue>{user.study}</RightbarInfoValue>
          </RightbarInfoItem>

          <RightbarInfoItem>
            <RightbarInfoKey>About yourself:</RightbarInfoKey>
            <RightbarInfoValue>{user.aboutme}</RightbarInfoValue>
          </RightbarInfoItem>
        </RightbarInfo>
      </AboutProfileWrapper>
    </AboutProfileContainer>
  );
};

export default AboutProfile;

const AboutProfileContainer = styled.div`
  -webkit-box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  /* min-height: 100vh; */
  width: calc(100vw - 100px);
  max-width: 800px;
  border-radius: 10px;
  justify-items: center;
  margin-left: 30px;
  background-color: ${(props) => props.theme.backgroundColorSecondary};

  @media (max-width: 400px){
    width: calc(100vw - 60px);
  }
`;
const AboutProfileWrapper = styled.div`
  padding: 20px;
`;
const RightbarTopRight = styled.div`
  display: flex;
`;
const RightbarTitle = styled.h4`
  font-size: 18px;
  font-weight: 500;
  margin: 0;
  margin-bottom: 5px;
  color: ${(props) => props.theme.tintColorPrimary};
`;

const RightbarInfo = styled.div`
  margin-bottom: 30px;
`;
const RightbarInfoItem = styled.div`
  margin-bottom: 10px;
`;
const RightbarInfoKey = styled.span`
  font-weight: 500;
  margin-right: 10px;
  color: ${(props) => props.theme.tintColorSecondary};
`;
const RightbarInfoValue = styled.span`
  font-weight: 300;
  font-size: 14px;
  color: ${(props) => props.theme.tintColorPrimary};
`;
