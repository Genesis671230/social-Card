import { createContext, useEffect, useReducer } from "react"
import AuthReducer from "./AuthReducer"

const INITIAL_STATE = {
    currentUser:  JSON.parse(localStorage.getItem("user")) ||  null
}

export const AuthorizationContext = createContext(INITIAL_STATE)

export const AuthorizationContextProvider = ({children})=>{
    const [state,authDispatch] = useReducer(AuthReducer, INITIAL_STATE);


    useEffect(()=>{
        localStorage.setItem("user",JSON.stringify(state.currentUser))
    },[state.currentUser])

    return (
    <AuthorizationContext.Provider value={{currentUser: state.currentUser,authDispatch}}>
        {children}
    </AuthorizationContext.Provider>
    );
};