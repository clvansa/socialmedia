import React from 'react';
import styled from 'styled-components';
import Topbar from '../components/Header/Topbar';
import Feed from '../components/Feed';
import SidebarContainer from '../components/Sidebar/SidebarContainer';
import Rightbar from '../components/Rightbar/Rightbar';
import ContactContianer from '../components/Rightbar/ContactContianer';

const Video = () => {
    return (
        <div>
            <Topbar />
            <VideoContainer>
                <SidebarContainer />
                <Feed video />
                <Rightbar />
                <ContactContianer />

            </VideoContainer>
        </div>
    )
}

export default Video;

const VideoContainer = styled.div`
    display: flex;
    background-color: ${props => props.theme.backgroundColor}

`


