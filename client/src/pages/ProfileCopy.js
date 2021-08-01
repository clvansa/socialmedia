import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import Topbar from '../components/Header/Topbar';
import Feed from '../components/Feed';
import { axiosInstance } from '../util/axiosInstance';
import { useParams } from 'react-router';
import { AuthContext } from '../context/AuthContext';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from '../util/TabPanel';
import UserInfoRightbar from '../components/Profile/UserInfoRightbar';
import UserFollowings from '../components/Profile/UserFollowings';
import AboutProfile from '../components/Profile/AboutProfile';
import FriendsProfile from '../components/Profile/FriendsProfile';
import SuggestedFriends from '../components/Profile/SuggestedFriends';
import FollowButton from '../components/Profile/FollowButton';
import ContactContianer from '../components/Rightbar/ContactContianer';
import ChangeProfileImages from '../components/Profile/ChangeProfileImages';
import decrypt from '../util/decrypt';


const Profile = () => {
    const [user, setUser] = useState({});
    const username = useParams().username;
    const [value, setValue] = useState(0);
    const scrollRef = useRef()
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user: currentUser } = useContext(AuthContext);

    useEffect(() => {
        let mounted = true;
        const fetchUser = async () => {
            const res = await axiosInstance.get(`/users/user?username=${username}`);
            const decrypted = await decrypt(res.data).then((data) => data)
            if (mounted) {
                setUser(decrypted)
            }
        }
        fetchUser()
        return () => mounted = false
    }, [username])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [])


    const a11yProps = (index) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    return (
        <div >
            <Topbar />
            <ProfileContainer ref={scrollRef} >
                <ProfileWrapper>
                    <ProfileTop>
                        <div style={{ maxWidth: "1200px", margin: "auto" }}>
                            <ProfileCover>
                                <ProfileCoverImage src={user?.coverPicture
                                    ? PF + user?.coverPicture
                                    : PF + "person/noCover.png"} />
                                {user._id === currentUser._id && <ChangeProfileImages />}
                                <ProfileUserImage src={user?.profilePicture
                                    ? PF + user?.profilePicture
                                    : PF + "person/noAvatar.png"} />
                            </ProfileCover>
                            <ProfileInfo>
                                <ProfileInfoName>{user.username}</ProfileInfoName>
                                <ProfileInfoDesc>{user.desc}</ProfileInfoDesc>
                            </ProfileInfo>
                            <div style={{ position: "relative" }}>
                                <AppBar position="static" color="transparent" style={{ boxShadow: "none" }}>
                                    <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                                        <Tab label="Posts" {...a11yProps(0)} />
                                        <Tab label="About" {...a11yProps(1)} />
                                        <Tab label="Friends" {...a11yProps(2)} />
                                    </Tabs>
                                </AppBar>
                                <FollowButton user={user} />
                            </div>
                        </div>
                    </ProfileTop>
                    <ProfileBottom>
                        <TabPanel value={value} index={0} >
                            <SuggestedFriends />
                            <Feed username={username} />
                            <ProfileBottomRight >
                                <UserInfoRightbar user={user} setValue={setValue} />
                                <UserFollowings user={user} setValue={setValue} />
                            </ProfileBottomRight>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <AboutProfile user={user} />
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <FriendsProfile user={user} />
                        </TabPanel>

                    </ProfileBottom>
                </ProfileWrapper>
                <ContactContianer />
            </ProfileContainer>
        </div>
    )
}

export default Profile

const ProfileContainer = styled.div`
    display: flex;
    background-color:${props => props.theme.backgroundColor};
    min-height:110vh;
  
`

const ProfileWrapper = styled.div`
    flex: 9;
    @media (max-width: 500px){
        width:480px;
    }
  
`
const ProfileTop = styled.div`
    background-color: ${props => props.theme.backgroundColorTop};
    color:${props => props.theme.tintColorSecondary};
    margin: auto;

`

const ProfileCover = styled.div`
    height: 420px;
    position: relative;
    width: 100%;

`


const ProfileCoverImage = styled.img`
    width: 100%;
    height: 350px;
    object-fit: cover;
    border-radius: 0 0 10px 10px;

`
const ProfileUserImage = styled.img`
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    position: absolute;
    left: 0;
    right: 0;
    top: 250px;
    margin: auto;
    border: 3px solid white;
    box-shadow: 0px 1px 6px 2px #eee;
    transition:filter 0.3s linear;

    &:hover{
        filter: grayscale(0.5);
    }
`

const ProfileInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    align-items: center;
`
const ProfileInfoName = styled.h4`
    font-size: 24px;
    margin: 0;
    color:${props => props.theme.tintColorPrimary};
`
const ProfileInfoDesc = styled.span`
    font-weight: 300;
    max-width: 800px;
`

const ProfileBottom = styled.div`
    display: flex;
    justify-content: space-between;
    margin:auto;
    max-width: 1040px;
    
`


const ProfileBottomRight = styled.div`
    position: sticky;
    top: 50px;
    padding-top: 20px;
    width: 350px;


    @media (max-width: 1040px) {
        width: 250px;
    }
    @media (max-width: 910px) {
        display: none;
    }
`
