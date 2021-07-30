import { LOGIN_START, LOGIN_SUCCESS, LOGIN_FAILURE, FOLLOW, UNFOLLOW, USER, LOGOUT } from './type';

const AuthReducer = (state, action) => {
    switch (action.type) {
        case LOGIN_START:
            return {
                user: null,
                isFetching: true,
                error: false,
                auth: false
            }
        case LOGIN_SUCCESS:
            return {
                user: action.payload,
                isFetching: false,
                error: false,
                auth: true
            }
        case LOGIN_FAILURE:
            return {
                user: null,
                isFetching: false,
                error: action.payload,
                auth: false
            }
        case FOLLOW:
            return {
                ...state,
                user: {
                    ...state.user,
                    followings: [...state.user.followings, action.payload]
                }
            }
        case UNFOLLOW:
            return {
                ...state,
                user: {
                    ...state.user,
                    followings: state.user.followings.filter(following => following !== action.payload)
                }
            }
        case USER:
            return {
                user: action.payload,
                isFetching: false,
                error: false,
                auth: true
            }
        case LOGOUT:
            return {
                user: null,
                isFetching: false,
                error: false,
                auth: false
            }


        default:
            return state
    }
}

export default AuthReducer;