import React from 'react';
import styled from 'styled-components';
import Topbar from '../components/Header/Topbar';
import Feed from '../components/Feed';
import SidebarContainer from '../components/Sidebar/SidebarContainer';
import Rightbar from '../components/Rightbar/Rightbar';
import ContactContianer from '../components/Rightbar/ContactContianer';

const BookMark = () => {
    return (
        <div>
            <Topbar />
            <BookmarkContainer>
                <SidebarContainer />
                <Feed bookmark />
                <Rightbar />
                <ContactContianer />

            </BookmarkContainer>
        </div>
    )
}

export default BookMark

const BookmarkContainer = styled.div`
    display:flex;
    background-color: ${props => props.theme.backgroundColor}

`
