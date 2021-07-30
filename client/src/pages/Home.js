import React from 'react';
import styled from 'styled-components';
import Topbar from '../components/Header/Topbar';
import SidebarContainer from '../components/Sidebar/SidebarContainer';
import ContactContianer from '../components/Rightbar/ContactContianer';
import Rightbar from '../components/Rightbar/Rightbar';
import Feed from '../components/Feed';

const Home = () => {

    return (
        <div >
            <Topbar />
            <HomeConatiner>
                <SidebarContainer />
                <Feed />
                <ContactContianer />
                <Rightbar />
            </HomeConatiner>

        </div>
    )
}

export default Home

const HomeConatiner = styled.div`
    display: flex;
    width: 100%;
    min-height: calc(100vh - 51px);
    background-color: ${props => props.theme.backgroundColor};
`
