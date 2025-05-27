import { createSlice } from "@reduxjs/toolkit";

interface User{
    _id : string;
    name : string;
    email : string;
    role : string
    avatar? : string
}

interface AuthState{
    user : User | null
    token : string | null
    isAuthenticated : boolean
}

const initialState : AuthState = {
    user : null,
    token : null,
    isAuthenticated : false
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        setUser: (state, action) => {
            state.user = action.payload
            state.isAuthenticated = true
        },
        setToken: (state, action) => {
            state.token = action.payload
        },
        logout: (state) => {
            state.user = null
            state.token = null
            state.isAuthenticated = false
        }
    }
})

export const {setUser, setToken, logout} = authSlice.actions
export default authSlice.reducer