import React, { useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import { CircularProgress } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { resetPasswordSchema } from '../util/yupSchema'
import {axiosInstance} from '../util/axiosInstance';

const ResetPassword = (props) => {
    const { isFetching, error } = useContext(AuthContext)
    const history = useHistory();
    const { register, setError, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(resetPasswordSchema),
    })


    const handleClick = async (data) => {
        console.log(data)
        const resetToken = props.match.params.resetToken;
        try {
            const res = await axiosInstance.put(`/auth/resetpassword/${resetToken}`, { password: data.password })
            history.push('/login')
        } catch (err) {
            setError('password', {
                type: 'server',
                message: err.response.data
            })
            history.push('/login')
        }

    }


    return (
        <LoginContainer>
            <LoginWrapper>
                <LoginLeft>
                    <LoginLogo>Social Media</LoginLogo>
                    <LoginDesc>Connect with freinds and the world arround you on Social Media</LoginDesc>
                </LoginLeft>
                <LoginRight>

                    <LoginBox onSubmit={handleSubmit(handleClick)}>
                        <LoginTitle>Reset Password</LoginTitle>

                        <ErrorBox >
                            <ErrorMessage>{errors.password?.message}</ErrorMessage>
                            <ErrorMessage>{errors.rePassword?.message === 'rePassword must be one of the following values: , Ref(password)'
                                ? 'Password not matched'
                                : errors.rePassword?.message}</ErrorMessage>
                        </ErrorBox>
                        <LoginInput placeholder="New Password" type="password" {...register('password')} />
                        <LoginInput placeholder="Confirm Password" type="password"  {...register('rePassword')} />
                        <LoginButton
                            type="submit"
                            variant="contained"
                            disabled={isFetching}
                        >{isFetching ? <CircularProgress size="20px" color="secondary" /> : "Reset Password"}</LoginButton>
                        <LoginBottom>


                        </LoginBottom>
                    </LoginBox>
                </LoginRight>
            </LoginWrapper>
        </LoginContainer>
    )
}

export default ResetPassword

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


const ErrorBox = styled.div`
    height: 50px;
`

const ErrorMessage = styled.p`
    color:red;
    margin: 0;
    font-size: 12px;
`