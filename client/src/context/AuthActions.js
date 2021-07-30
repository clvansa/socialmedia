import { LOGIN_START, LOGIN_SUCCESS, LOGIN_FAILURE, USER, LOADING, LOGOUT } from './type';
import axios from 'axios';

// export const LoginStart = (user) => ({
//     type: LOGIN_START
// })
// export const LoginSuccess = (user) => ({
//     type: LOGIN_SUCCESS,
//     payload: user

// })
// export const LoginFailure = (error) => ({
//     type: LOGIN_FAILURE,
//     payload: error
// })

export const LoginUser = async (userCrendentail, dispatch, history) => {
    dispatch({
        type: LOGIN_START
    })
    try {
        const res = await axios.post('auth/login', userCrendentail)
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        })
        await localStorage.setItem('token', res.data.token)
        const token = `Bearer ${res.data.token}`
        axios.defaults.headers.common['authorization'] = token
        GetOwnUser(dispatch)
        history.push('/home')
    } catch (err) {
        dispatch({
            type: LOGIN_FAILURE,
            payload: err.response.data
        })
    }

}

export const Follow = async (userId) => {

}

const isAuthorization = async () => {
    const token = await `Bearer ${localStorage.getItem('token')}`
    return axios.defaults.headers.common['authorization'] = await token
}


export const GetOwnUser = async (dispatch) => {
    try {
        dispatch({ type: LOGIN_START })
        await isAuthorization()
        const res = await axios.get(`/users/myuser`)
        dispatch({
            type: USER,
            payload: res.data
        })
    } catch (err) {
        console.log(err)
    }
}


export const GetUser = async (userId, dispatch) => {
    try {
        dispatch({ type: LOGIN_START })
        const res = await axios.get(`/users/user?userId=${userId}`)
        dispatch({
            type: USER,
            payload: res.data
        })
    } catch (err) {
        console.log(err)
    }
}

export const Logout = async (history, dispatch) => {
    try {
        dispatch({ type: LOGOUT })
        localStorage.removeItem('token')
        history.push('/login')
    } catch (err) {
        console.log(err)
    }
}