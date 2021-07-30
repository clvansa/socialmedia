import { createContext, useReducer, useRef, useEffect, useState } from "react";
import AuthReducer from "./AuthReducer";


const INITIAL_STATE = {
    user: null,
    isFetching: false,
    error: false,
    auth: false
}

export const AuthContext = createContext(INITIAL_STATE)


export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);






    const socketRef = useRef();
    return (
        <AuthContext.Provider value={{
            user: state.user,
            isFetching: state.isFetching,
            error: state.error,
            auth: state.auth,
            dispatch,

        }}>
            {children}
        </AuthContext.Provider>
    )
}