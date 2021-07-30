import React, { useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { LoginUser } from '../context/AuthActions';
import { AuthContext } from '../context/AuthContext';
import { CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';

const Login = ({ history }) => {

    const email = useRef();
    const password = useRef();
    const { user, isFetching, error, dispatch } = useContext(AuthContext);

    const handleClick = (e) => {
        e.preventDefault();
        LoginUser({
            email: email.current.value,
            password: password.current.value
        }, dispatch, history)

    }

    useEffect(() => {
        if (localStorage.getItem("token")) {
            history.push("/home");
        }
    }, [history]);


    return (
        <LoginContainer>
            <LoginWrapper>
                <LoginLeft>
                    <LoginLogo>Social Media</LoginLogo>
                    <LoginDesc>Connect with freinds and the world arround you on Social Media</LoginDesc>
                </LoginLeft>
                <LoginRight>

                    <LoginBox onSubmit={handleClick}>
                        <LoginTitle>Login</LoginTitle>
                        <ErrorBox >
                            <ErrorMessage>{error}</ErrorMessage>
                        </ErrorBox>
                        <LoginInput placeholder="Email" type="email" ref={email} required />
                        <LoginInput placeholder="Password" type="password" minLength="6" ref={password} required />
                        <LoginButton
                            type="submit"
                            variant="contained"
                            disabled={isFetching}
                        >{isFetching ? <CircularProgress size="20px" color="secondary" /> : "Login"}</LoginButton>
                        <LoginBottom>
                            <Link to="/forgetpassword">
                                <LoginForgot>
                                    {isFetching
                                        ? <CircularProgress size="20px" color="secondary" />
                                        : "Forgot Password?"}
                                </LoginForgot>
                            </Link>
                            <Link to="/register" style={{ display: "block" }}>
                                <RegisterBottom disabled={isFetching} >{isFetching ? <CircularProgress size="20px" color="secondary" /> : "Create a new Account"}</RegisterBottom>
                            </Link>
                        </LoginBottom>
                    </LoginBox>
                </LoginRight>
            </LoginWrapper>
        </LoginContainer>
    )
}

export default Login

const LoginContainer = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: ${props => props.theme.backgroundColor};
    display: flex;
    justify-content: center;
    align-items: center;

   
    `

const LoginWrapper = styled.div`
    width: 70%;
    height:100%;
    display: flex;
    flex-wrap: wrap;

    `
const LoginLeft = styled.div`
    display: flex;
    flex-direction: column;
    flex:1;
    justify-content:center ;
    min-width: 350px;

`
const LoginLogo = styled.h3`
    font-size:50px;
    font-weight: 800;
    color:#1775ee;
    margin-bottom:10px ;
`
const LoginDesc = styled.span`
    font-size: 24px;
    padding-right: 20px;
    color:${props => props.theme.tintColorPrimary};
`

const LoginRight = styled.div`
    display: flex;
    flex-direction: column;
    flex:1;
    justify-content:center;
    
`
const LoginTitle = styled.h2`
    color:${props => props.theme.tintColorPrimary};
    margin: 0;
`
const ErrorBox = styled.div`
    height: 50px;
`
const ErrorMessage = styled.p`
    color:red;
`

const LoginBox = styled.form`
    max-width:450px;
    height: 400px;
    padding: 40px;
    background-color: ${props => props.theme.backgroundColorSecondary};
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    -webkit-box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
    box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
    

`
const LoginInput = styled.input`
    height: 50px;
    border-radius: 10px;
    border: 1px solid ${props => props.theme.grayColor};
    background-color: ${props => props.theme.inputBackgroundColor};
    color:${props => props.theme.tintColorPrimary};
    font-size: 18px;
    padding-left: 20px;
    &:focus{
        outline: none;
    }
`
const LoginButton = styled(Button)`
    height: 50px;
    border-radius: 10px;
    border: none;
    background-color: #1775ee !important;
    font-size: 20px;
    font-weight: 500;
    color:${props => props.theme.tintColorPrimary} !important ;
    text-transform: capitalize !important;
    cursor: pointer;
    &:focus{
        outline: none;
    }
    &:disabled{
        cursor: not-allowed;
    }
`


const LoginForgot = styled(Button)`
    text-align: center;
    color:${props => props.theme.tintColorSecondary} !important ;
    text-transform: capitalize !important ;
`


const LoginBottom = styled.div`
    display: flex;
    align-items: center;
    justify-content:space-around;

`
const RegisterBottom = styled(Button)`
    color: #42b72a !important;
    text-transform: capitalize !important ;

`