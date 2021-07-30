import styled from "styled-components";

const CloseFriend = ({ user }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <SidebarFriend>
      <SidebarFriendImage
        src={
          user?.profilePicture
            ? `${PF}${user?.profilePicture}`
            : `${PF}person/noAvatar.png`
        }
      />
      <SidebarFriendName>{user?.username}</SidebarFriendName>
    </SidebarFriend>
  );
};

export default CloseFriend;

const SidebarFriend = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding-left: 10px;
`;
const SidebarFriendImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
`;
const SidebarFriendName = styled.span`
  color: ${(props) => props.theme.tintColorSecondary};
`;
