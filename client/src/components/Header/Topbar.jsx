import { useContext, useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Person, Search, Chat, Notifications } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../util/axiosInstance";
import Notification from "./Notification";
import useOutside from "../../util/useOutside";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import NotificationChat from "./NotificationChat";
import ProfileMenuList from "./ProfileMenuList";

const Topbar = () => {
  const { user } = useContext(AuthContext);
  const { arrivalNotification, arrivalMessage, conversationId } =
    useContext(SocketContext);

  const [open, setOpen] = useState(false);
  const [openNotifyChat, setOpenNotifyChat] = useState(false);
  const [openNotifyFollow, setOpenNotifyFollow] = useState(false);
  const [search, setSearch] = useState("");
  const [userResult, setUserResult] = useState([]);
  const [notificationsChat, setNotificationsChat] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationsFollow, setNotificationsFollow] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const wrapperRef = useRef(null);
  const chatRef = useRef(null);
  const followRef = useRef(null);
  useOutside(wrapperRef, setOpen);
  useOutside(chatRef, setOpenNotifyChat);
  useOutside(followRef, setOpenNotifyFollow);

  //Get Notification from Database
  useEffect(() => {
    let mounted = true;
    const getNotifications = async () => {
      try {
        const res = await axiosInstance.get(`/users/notification/`);
        if (mounted) {
          setNotifications(
            res.data.filter(
              (notification) => notification.notifyType !== "user"
            )
          );
          setNotificationsFollow(
            res.data.filter(
              (notification) => notification.notifyType === "user"
            )
          );
        }
      } catch (err) {
        console.log(err);
      }
    };
    getNotifications();

    return () => (mounted = false);
  }, [open, openNotifyFollow, arrivalNotification]);

  //Searchbar
  useEffect(() => {
    search.trim() && setUserResult([]);
  }, [search]);

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
  // useEffect(() => {
  //   arrivalNotification && (arrivalNotification.notifyType !== "user")
  //     ? console.log('noti lik',arrivalNotification)
  //     : console.log('noti user',notificationsFollow);
  // }, [arrivalNotification]);

  useEffect(() => {
    let mounted = true;

    const getChatNotification = async () => {
      try {
        const res = await axiosInstance.get(`/message/unseen/message`);
        if (mounted) {
          setNotificationsChat(
            res.data.filter((coversation) => !!coversation.length)
          );
        }
      } catch (err) {
        console.log(err);
      }
    };
    user && getChatNotification();
    return () => (mounted = false);
  }, [arrivalMessage, conversationId]);

  return (
    <TopbarContainer>
      <TopbarLeft>
        <Link to="/home">
          <TopbarLogo>Social Media</TopbarLogo>
        </Link>
      </TopbarLeft>
      <TopbarCenter search={search}>
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
                <Link
                  to={`/profile/${u?.username}`}
                  key={u?._id}
                  onClick={() =>
                    (window.location.href = `/profile/${u?.username}`)
                  }
                >
                  <SearchListItem>
                    <SearchListItemImg src={u?.profilePicture} />
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
          <TopbarIconsItem ref={followRef}>
            <Person onClick={() => setOpenNotifyFollow(true)} />
            <Notification
              open={openNotifyFollow}
              notifications={notificationsFollow}
            />
            {!!notificationsFollow.length && (
              <TopbarIconBadge>{notificationsFollow.length}</TopbarIconBadge>
            )}
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
            {notifications?.length > 0 && (
              <TopbarIconBadge>{notifications?.length}</TopbarIconBadge>
            )}
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

  @media (max-width: 500px) {
    flex: 12;
  }
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

  @media (max-width: 320px) {
    font-size: 10px;
  }
`;
const SearchBar = styled.div`
  width: 90%;
  height: 35px;
  background-color: ${(props) => props.theme.inputBackgroundColor};
  border-radius: 30px;
  display: flex;
  align-items: center;

  @media (max-width: 500px) {
    display: none;
  }
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
  border: 1px solid
    ${(props) => (props.search !== "" ? props.theme.grayColor : "transparent")};
`;

const SearchContianer = styled.div`
  position: absolute;
  top: 50px;
  left: -1px;
  background-color: ${(props) => props.theme.TopbarBackgroundColor};
  width: 100%;
  border-radius: 0 0 10px 10px;
  box-shadow: 0px 10px 16px -8px rgb(0 0 0 / 68%);
  border-left: 1px solid ${(props) => props.theme.grayColor};
  border-right: 1px solid ${(props) => props.theme.grayColor};
  border-bottom: 1px solid ${(props) => props.theme.grayColor};
  max-height: 400px;
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
  word-break: break-all;
  white-space: nowrap;
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
