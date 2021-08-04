import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Topbar from '../components/Header/Topbar';
import Sidebar from '../components/Sidebar/Sidebar';
import Rightbar from '../components/Rightbar/Rightbar';
import Feed from '../components/Feed';
import axios from 'axios';
import { useParams } from 'react-router';
import EditIcon from '@material-ui/icons/Edit';



const Profile = () => {
    const [user, setUser] = useState({});
    const username = useParams().username;
    const scrollRef = useRef()
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users/user?username=${username}`)
            setUser(res.data)
        }
        fetchUser()
    }, [username])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [])


    return (
        <div >
            <Topbar />
            <ProfileContainer ref={scrollRef} >
                <Sidebar />
                <ProfileRight>
                    <ProfileRightTop>
                        <ProfileCover>
                            <ProfileCoverImage src={user?.coverPicture} />
                            <EditIcon style={{ position: "absolute", bottom: "80px", right: 0 }} />
                            <ProfileUserImage src={user?.profilePicture
                            } />
                        </ProfileCover>
                        <ProfileInfo>
                            <ProfileInfoName>{user.username}</ProfileInfoName>
                            <ProfileInfoDesc>{user.desc}</ProfileInfoDesc>
                            {/* {city} */}
                        </ProfileInfo>
                    </ProfileRightTop>
                    <ProfileRightBottom>
                        <Feed username={username} />
                        <Rightbar user={user} />
                    </ProfileRightBottom>
                </ProfileRight>
            </ProfileContainer>
        </div>
    )
}

export default Profile

const ProfileContainer = styled.div`
    display: flex;
`

const ProfileRight = styled.div`
    flex: 9;
`
const ProfileRightTop = styled.div`
`

const ProfileCover = styled.div`
    height: 320px;
    position: relative;

`


const ProfileCoverImage = styled.img`
    width: 100%;
    height: 250px;
    object-fit: cover;
`
const ProfileUserImage = styled.img`
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    position: absolute;
    left: 0;
    right: 0;
    top: 150px;
    margin: auto;
    border: 3px solid #ffffff;
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
`
const ProfileInfoDesc = styled.span`
    font-weight: 300;
`

const ProfileRightBottom = styled.div`
    display: flex;
`
