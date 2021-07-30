import axios from 'axios';
import React, { useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import { Button } from '@material-ui/core';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { registerSchema } from '../util/yupSchema'
import { CircularProgress } from '@material-ui/core';


const Register = () => {
    const history = useHistory();

    const { isFetching } = useContext(AuthContext)
    const { register, setError, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(registerSchema),
    })

    const handleClick = async (data) => {
        const user = {
            username: data.username,
            email: data.email,
            password: data.password
        }
        try {
            await axios.post('/auth/register', user);
            history.push('/login')

        } catch (err) {
            console.log(err)
            setError('username', {
                type: 'server',
                message: 'user is exists, try another username'
            })
        }
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

                    <LoginBox onSubmit={handleSubmit(handleClick)}>
                        <LoginTitle>Register</LoginTitle>
                        <ErrorBox >
                            <ErrorMessage>{errors.username?.message}</ErrorMessage>
                            <ErrorMessage>{errors.email?.message}</ErrorMessage>
                            <ErrorMessage>{errors.password?.message}</ErrorMessage>
                            <ErrorMessage>{errors.rePassword?.message === 'rePassword must be one of the following values: , Ref(password)'
                                ? 'Password not matched'
                                : errors.rePassword?.message}</ErrorMessage>
                        </ErrorBox>

                        <LoginInput
                            placeholder="Username"
                            {...register('username')} />

                        <LoginInput
                            placeholder="Email"
                            type="email"
                            {...register('email')} />

                        <LoginInput
                            placeholder="Password"
                            type="password"
                            {...register('password')} />

                        <LoginInput
                            placeholder="Repassword"
                            type="password"
                            {...register('rePassword')} />

                        <LoginButton type="submit">
                            {isFetching
                                ? <CircularProgress size="20px" color="secondary" />
                                : "Sign Up"}

                        </LoginButton>
                        <RegisterLogin>If you have a account <Link to="/login">
                            <b style={{ color: "#42b72a" }}>Login</b>
                        </Link></RegisterLogin>
                    </LoginBox>
                </LoginRight>
            </LoginWrapper>
        </LoginContainer>
    )
}

export default Register

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
    height:70%;
    display: flex;

`
const LoginLeft = styled.div`
    display: flex;
    flex-direction: column;
    flex:1;
    justify-content:center ;

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
const LoginBox = styled.form`
    max-width:450px;
    height: 500px;
    padding: 40px;
    background-color: ${props => props.theme.backgroundColorSecondary};
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    -webkit-box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
    box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
    
`

const LoginTitle = styled.h2`
    color:${props => props.theme.tintColorPrimary};
    margin: 0;
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
const RegisterLogin = styled.span`
    align-self: center;
    color:${props => props.theme.tintColorPrimary};

    >b{
        cursor: pointer;
        &:hover{
            text-decoration: underline;
        }
    }
`

const ErrorBox = styled.div`
    height: 60px;
`
const ErrorMessage = styled.p`
    color:red;
    margin: 0;
    font-size: 12px;
`
