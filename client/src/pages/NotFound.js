import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFound = () => (
    <Container>
        <h1>404 - Page not Found!</h1>
        <Link to="/">
            Go to Home
        </Link>
    </Container>
);

export default NotFound;


const Container = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction: column;
    min-height: 100vh;
    height: calc(30vh - 50px);
    background-color:${props => props.theme.backgroundColor};
    color:${props => props.theme.tintColorSecondary};

`