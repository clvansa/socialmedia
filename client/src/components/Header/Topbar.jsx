import { useContext, useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Person, Search, Chat, Notifications } from "@material-ui/icons";
import { Link, useHistory } from "react-router-dom";
import { IconButton, Button } from "@material-ui/core";
import {axiosInstance} from "../../util/axiosInstance";
import Notification from "./Notification";
import useOutside from "../../util/useOutside";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import { Logout } from "../../context/AuthActions";
import NotificationChat from "./NotificationChat";
import ProfileMenuList from "./ProfileMenuList";

const Topbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const { arrivalNotification, arrivalMessage, conversationId } =
    useContext(SocketContext);

  const [open, setOpen] = useState(false);
  const [openNotifyChat, setOpenNotifyChat] = useState(false);
  const [search, setSearch] = useState("");
  const [userResult, setUserResult] = useState([]);
  const [notificationsChat, setNotificationsChat] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const history = useHistory();
  const wrapperRef = useRef(null);
  const chatRef = useRef(null);
  useOutside(wrapperRef, setOpen);
  useOutside(chatRef, setOpenNotifyChat);

  const handleLogout = () => {
    Logout(history, dispatch);
  };

  //Get Notification from Database
  useEffect(() => {
    const getNotifications = async () => {
      try {
        const res = await axiosInstance.get(`/users/notification/`);
        setNotifications(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getNotifications();
  }, [open, arrivalNotification]);

  //Searchbar
  useEffect(() => {
    search.trim() && setUserResult([]);
  }, [search.trim()]);

  //Search func from database
  const getUser = async (e) => {
    setSearch(e.target.value);
    try {
      if (!e.target.value) return;
      const res = await axiosInstance.get(
        `/users/search?username=${e.target.value.toLowerCase()}`
      );
      setUserResult(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  //get Notification from socket
  useEffect(() => {
    arrivalNotification &&
      setNotifications((prvState) => [...prvState, arrivalNotification]);
  }, [arrivalNotification]);

  useEffect(() => {
    const getChatNotification = async () => {
      try {
        const res = await axiosInstance.get(`/message/unseen/message`);
        setNotificationsChat(
          res.data.filter((coversation) => !!coversation.length)
        );
      } catch (err) {
        console.log(err);
      }
    };
    user && getChatNotification();
    console.log(conversationId);
  }, [arrivalMessage, conversationId]);

  return (
    <TopbarContainer>
      <TopbarLeft>
        <Link to="/home">
          <TopbarLogo>Social Media</TopbarLogo>
        </Link>
      </TopbarLeft>
      <TopbarCenter>
        <SearchBar>
          <SearchIcon />
          <SearchInput
            placeholder="Search for freind, post or video"
            onChange={getUser}
            value={search}
          />
        </SearchBar>
        <SearchContianer style={{ display: search ? "flex" : "none" }}>
          {userResult ? (
            <SearchList>
              {userResult.map((u) => (
                <Link to={`/profile/${u?.username}`}
                 key={u?._id}
                 onClick={() =>
                  (window.location.href = `/profile/${u?.username}`)
                }>
                  <SearchListItem>
                    <SearchListItemImg
                      src={
                        u?.profilePicture
                          ? PF + u?.profilePicture
                          : PF + "person/noAvatar.png"
                      }
                    />
                    <SearchListItemContainer>
                      <SearchListItemName>{u?.username}</SearchListItemName>
                      <SearchListItemType>
                        {user?.followings.includes(u?._id)
                          ? "Friend"
                          : user?._id === u?._id
                          ? "You"
                          : ""}
                      </SearchListItemType>
                    </SearchListItemContainer>
                  </SearchListItem>
                </Link>
              ))}
            </SearchList>
          ) : (
            <p>No recent searches</p>
          )}
        </SearchContianer>
      </TopbarCenter>
      <TopbarRight>
        <TopbarLinks>
          <Link
            to={`/profile/${user?.username}`}
            onClick={() =>
              (window.location.href = `/profile/${user?.username}`)
            }
          >
            <TopbarLink>Profile</TopbarLink>
          </Link>
          <Link to="/home">
            <TopbarLink>Timeline</TopbarLink>
          </Link>
        </TopbarLinks>
        <TopbarIcons>
          <TopbarIconsItem>
            <Person />
            <TopbarIconBadge>1</TopbarIconBadge>
          </TopbarIconsItem>

          <TopbarIconsItem ref={chatRef}>
            <Chat
              onClick={() => {
                setOpenNotifyChat(true);
              }}
            />
            <NotificationChat
              open={openNotifyChat}
              notifications={notificationsChat}
            />
            {!!notificationsChat.length && (
              <TopbarIconBadge>{notificationsChat.length}</TopbarIconBadge>
            )}
          </TopbarIconsItem>

          <TopbarIconsItem ref={wrapperRef}>
            <Notifications onClick={() => setOpen(true)} />
            <Notification open={open} notifications={notifications} />
            <TopbarIconBadge>{notifications?.length}</TopbarIconBadge>
          </TopbarIconsItem>
        </TopbarIcons>
        <ProfileMenuList />
      </TopbarRight>
    </TopbarContainer>
  );
};

export default Topbar;

const TopbarContainer = styled.div`
  height: 50px;
  width: 100%;
  background-color: ${(props) => props.theme.TopbarBackgroundColor};
  border-bottom: 0.5px solid ${(props) => props.theme.grayColor};
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 9999;
`;
const TopbarLeft = styled.div`
  flex: 3;
`;
const TopbarLogo = styled.span`
  font-size: 24px;
  margin-left: 20px;
  font-weight: bold;
  color: white;
  cursor: pointer;

  @media (max-width: 910px) {
    font-size: 18px;
  }

  @media (max-width: 765px) {
    font-size: 12px;
  }

  @media (max-width: 600px) {
    /* display: none; */
    margin-left: 35px;
  }
`;
const SearchBar = styled.div`
  width: 90%;
  height: 35px;
  background-color: ${(props) => props.theme.inputBackgroundColor};
  border-radius: 30px;
  display: flex;
  align-items: center;
`;
const SearchIcon = styled(Search)`
  font-size: 20px !important;
  margin-left: 10px;
  color: ${(props) => props.theme.tintColorSecondary};
`;
const SearchInput = styled.input`
  border: none;
  width: 60%;
  height: 30px;
  background-color: ${(props) => props.theme.inputBackgroundColor};
  color: ${(props) => props.theme.tintColorSecondary};
  &:focus {
    outline: none;
  }
`;
const TopbarCenter = styled.div`
  flex: 5;
  display: flex;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;
  align-items: center;
  box-shadow: ${(props) =>
    props.search && "0px 0px 16px -8px rgb(0 0 0 / 68%)"};
`;

const SearchContianer = styled.div`
  position: absolute;
  top: 50px;
  left: 0;
  background-color: ${(props) => props.theme.TopbarBackgroundColor};
  width: 100%;
  border-radius: 0 0 10px 10px;
  box-shadow: 0px 0px 16px -8px rgb(0 0 0 / 68%);
`;
const SearchList = styled.ul`
  list-style: none;
  width: 100%;
  margin: 10px 0;
  padding-inline-start: 0;
`;

const SearchListItem = styled.li`
  box-sizing: border-box;
  height: 50px;
  display: flex;
  align-items: center;
  width: 96%;
  padding: 10px;
  margin-left: 10px;
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    background-color: #7575757b;
  }
`;

const SearchListItemContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SearchListItemName = styled.span`
  color: white;
  font-weight: 300;
  letter-spacing: 1px;
`;

const SearchListItemType = styled.span`
  margin: 0;
  padding: 0;
  font-size: 12px;
  color: darkgray;
  font-weight: 300;
`;

const SearchListItemImg = styled.img`
  height: 36px;
  width: 36px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
  border: 2px solid #ffffff;
`;
const TopbarRight = styled.div`
  flex: 4;
  display: flex;
  align-items: center;
  justify-content: space-around;
  color: #ffffff;
`;
const TopbarLinks = styled.div`
  @media (max-width: 620px) {
    display: none;
  }
`;
const TopbarLink = styled.span`
  margin-right: 10px;
  font-size: 14px;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #302f2f6c;
  }
`;
const TopbarIcons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const TopbarIconsItem = styled.div`
  box-sizing: border-box;
  margin-right: 15px;
  cursor: pointer;
  position: relative;
  /* padding: 3px; */
`;
const TopbarIconBadge = styled.span`
  width: 15px;
  height: 15px;
  font-size: 12px;
  background-color: red;
  color: #ffffff;
  position: absolute;
  top: -5px;
  right: -5px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
