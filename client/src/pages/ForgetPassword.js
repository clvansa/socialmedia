import React, { useContext, useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import { CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import {axiosInstance} from '../util/axiosInstance';

const ForgetPassword = ({ history }) => {

    const email = useRef();
    const { isFetching } = useContext(AuthContext)
    const [error, setError] = useState(null)
    const [step, setStep] = useState(1)

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post(`/auth/forgotpassword`, { email: email.current.value })
            setStep(2)
        } catch (err) {
            console.log(err)
            setError(err.response.data)
        }
    }

    useEffect(() => {
        const timeOut = setTimeout(() => {
            setStep(1)
            setError(null)
        }, 10000)

        return () => clearTimeout(timeOut)
    }, [step])


    return (
        <LoginContainer>
            <LoginWrapper>
                <LoginLeft>
                    <LoginLogo>Social Media</LoginLogo>
                    <LoginDesc>Connect with freinds and the world arround you on Social Media</LoginDesc>
                </LoginLeft>
                {step === 1 &&
                    <LoginRight>
                        <LoginBox onSubmit={handleClick}>
                            <LoginTitle>Forget Password</LoginTitle>
                            <ErrorBox >
                                <ErrorMessage>{error}</ErrorMessage>
                            </ErrorBox>
                            <LoginInput placeholder="Email" type="email" ref={email} required />
                            <LoginButton
                                type="submit"
                                variant="contained"
                                disabled={isFetching}
                            >{isFetching ? <CircularProgress size="20px" color="secondary" /> : "Send Email"}</LoginButton>
                            <LoginBottom>

                                <Link to="/login">
                                    <LoginForgot>
                                        {isFetching
                                            ? <CircularProgress size="20px" color="secondary" />
                                            : "Login"}
                                    </LoginForgot>
                                </Link>

                                <Link to="/register" style={{ display: "block" }}>
                                    <RegisterBottom disabled={isFetching} >
                                        {isFetching
                                            ? <CircularProgress size="20px" color="secondary" />
                                            : "Create a new Account"}
                                    </RegisterBottom>
                                </Link>
                            </LoginBottom>
                        </LoginBox>
                    </LoginRight>}
                {step === 2 &&
                    <LoginRight>
                        <SendEmailBox >
                            <SendEmail>
                                <EmailIconCss />Email has beed sended</SendEmail>
                            <Link to="/login">
                                <LoginForgot style={{ alignItems: "center" }}>
                                    {isFetching
                                        ? <CircularProgress size="20px" color="secondary" />
                                        : "Back to login"}
                                </LoginForgot>
                            </Link>

                        </SendEmailBox>
                    </LoginRight>
                }
            </LoginWrapper>
        </LoginContainer>
    )
}

export default ForgetPassword

const LoginContainer = styled.div`
    width: 100%;
    min-height: calc(100vh - 20px);
    background-color: ${props => props.theme.backgroundColor};
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 20px;
   
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
    padding-bottom: 20px;

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
    height: 300px;
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
const LoginBottom = styled.div`
    display: flex;
    align-items: center;
    justify-content:space-around;

`

const LoginForgot = styled(Button)`
    text-align: center;
    color:${props => props.theme.tintColorPrimary} !important ;
    text-transform: capitalize !important ;
`



const RegisterBottom = styled(Button)`
    color: #42b72a !important;
    text-transform: capitalize !important ;

`
const SendEmailBox = styled.div`
    height: auto;
    padding: 40px;
    background-color: ${props => props.theme.backgroundColorSecondary};
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    -webkit-box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
    box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
`

const SendEmail = styled.h3`
        color:${props => props.theme.tintColorPrimary} !important ;
        display:flex;
        align-items: center;

`

const EmailIconCss = styled(EmailIcon)`
        color:${props => props.theme.tintColorPrimary} !important ;
        font-size:30px !important ;
        padding-right:10px;

`