import React, { useContext, useEffect, useState } from 'react';
import styled from "styled-components";
import ChatMessenger from '../components/Chat/ChatMessenger';
import { AuthContext } from '../context/AuthContext';
import ChatMessagerConversation from '../components/Chat/ChatMessagerConversation';
import Topbar from '../components/Header/Topbar';
import { useLocation } from 'react-router-dom'
import ChatContactContainer from '../components/Chat/ChatContactContainer';
import ChatConversationContainer from '../components/Chat/ChatConversationContainer';

const Chat = () => {
    const { user } = useContext(AuthContext);
    const [currentChat, setCurrentChat] = useState(null);
    const location = useLocation().state;

    useEffect(() => {
        setCurrentChat(location)
    }, [location])


    return (
        <>
            <Topbar />
            <ChatContainer>
                <ChatContainerLeft>
                    {/* <ChatMessagerConversation
                        user={user}
                        setCurrentChat={setCurrentChat}
                        currentChat={currentChat}
                    /> */}
                    <ChatConversationContainer user={user}
                        setCurrentChat={setCurrentChat}
                        currentChat={currentChat} />
                </ChatContainerLeft>
                <ChatContainerCenter>
                    <ChatMessenger currentChat={currentChat}  />
                </ChatContainerCenter>
                <ChatContainerRight>
                    <ChatContactContainer setCurrentChat={setCurrentChat} currentUserId={user._id} />
                </ChatContainerRight>
            </ChatContainer>
        </>

    )
}

export default Chat;

const ChatContainer = styled.div`
    display: flex;
    background-color: ${(props) => props.theme.backgroundColor};
    min-height: calc(100vh - 51px);
    /* width: 100%; */
    overflow: hidden;


`
const ChatContainerLeft = styled.div`
    /* flex: 3; */
`
const ChatContainerCenter = styled.div`
    flex: 6;
    height: calc(100vh - 71px);
`
const ChatContainerRight = styled.div`
    /* flex: 3; */
    /* width: 300px; */
 

`

