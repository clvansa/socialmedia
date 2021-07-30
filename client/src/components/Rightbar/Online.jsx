import { useContext } from "react";
import styled from "styled-components";
import { SocketContext } from "../../context/SocketContext";

const Online = ({ user }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { onlineUsers } = useContext(SocketContext);
  return (
    <RightbarFriend>
      <RightbarProfileImageContainer>
        <RightbarProfileImage
          src={
            user?.profilePicture
              ? PF + user.profilePicture
              : PF + "person/noAvatar.png"
          }
          alt="profile Picture"
        />
        {onlineUsers?.includes(user._id) && <RightbarOnline />}
      </RightbarProfileImageContainer>
      <RightbarUsername>{user.username} </RightbarUsername>
    </RightbarFriend>
  );
};

export default Online;

const RightbarFriend = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  cursor: pointer;
  color: ${(props) => props.theme.tintColorPrimary};
`;
const RightbarProfileImageContainer = styled.div`
  margin-right: 10px;
  position: relative;
`;
const RightbarProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;
const RightbarOnline = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: limegreen;
  position: absolute;
  top: -2px;
  right: 0;
  border: 2px solid #ffffff;
`;
const RightbarUsername = styled.span`
  font-weight: 500;
`;
