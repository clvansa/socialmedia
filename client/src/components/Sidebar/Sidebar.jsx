import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import {
  RssFeed,
  Chat,
  PlayCircleFilled,
  Group,
  Bookmark,
  Help,
  Event,
} from "@material-ui/icons";
import CloseFriend from "./CloseFriend";
import { AuthContext } from "../../context/AuthContext";
import {axiosInstance} from "../../util/axiosInstance";
import { Link, useLocation } from "react-router-dom";
import LocalHospitalIcon from "@material-ui/icons/LocalHospital";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const res = await axiosInstance.get(`/users/suggestedfriends`);
        setFollowers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, []);

  return (
    <SideBarConatiner>
      <SidebarWrapper>
        <SidebarList>
          <Link
            to="/home"
            onClick={() =>
              location.pathname === "/home" &&
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
          >
            <SidebarListItem>
              <RssFeed />
              <SidebarListItemText>Feed</SidebarListItemText>
            </SidebarListItem>
          </Link>
          <Link to="/chat">
            <SidebarListItem>
              <Chat />
              <SidebarListItemText>Chat</SidebarListItemText>
            </SidebarListItem>
          </Link>
          <Link
            to="/video"
            onClick={() =>
              location.pathname === "/video" &&
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
          >
            <SidebarListItem>
              <PlayCircleFilled />
              <SidebarListItemText>Video</SidebarListItemText>
            </SidebarListItem>
          </Link>

          <Link
            to="/covid"
            onClick={() =>
              location.pathname === "/covid" &&
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
          >
            <SidebarListItem>
              <LocalHospitalIcon />
              <SidebarListItemText>Covid-19</SidebarListItemText>
            </SidebarListItem>
          </Link>
          <Link
            to="/bookmark"
            onClick={() =>
              location.pathname === "/bookmark" &&
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
          >
            <SidebarListItem>
              <Bookmark />
              <SidebarListItemText>Bookmarks</SidebarListItemText>
            </SidebarListItem>
          </Link>

          <SidebarListItem>
            <Help />
            <SidebarListItemText>Question</SidebarListItemText>
          </SidebarListItem>

          <SidebarListItem>
            <Event />
            <SidebarListItemText>Event</SidebarListItemText>
          </SidebarListItem>
        </SidebarList>

        <Button>Show More</Button>
        <SidebarHr />
        <SidebarFriendList>
          {followers.map((user) => (
            <Link to={`/profile/${user.username}`} key={user._id}>
              <CloseFriend key={user._id} user={user} />
            </Link>
          ))}
        </SidebarFriendList>
      </SidebarWrapper>
    </SideBarConatiner>
  );
};

export default Sidebar;

const SideBarConatiner = styled.div`
  height: calc(100vh - 75px);
  overflow: hidden;

  &:hover {
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
  }
`;

const SidebarWrapper = styled.div`
  padding: 20px 0px 20px 10px;
`;

const SidebarList = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
`;
const SidebarListItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px 0px 10px 10px;
  border-radius: 10px;
  cursor: pointer;
  color: ${(props) => props.theme.tintColorPrimary};

  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;
const SidebarListItemText = styled.span`
  margin-left: 15px;
`;

const Button = styled.button`
  width: 150px;
  border: none;
  padding: 10px;
  border-radius: 5px;
  font-weight: 400;
  @media (max-width: 910px) {
    display: none;
  }
`;

const SidebarHr = styled.hr`
  margin: 20px 0;
  @media (max-width: 910px) {
    display: none;
  }
`;

const SidebarFriendList = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;

  @media (max-width: 910px) {
    display: none;
  }
`;
