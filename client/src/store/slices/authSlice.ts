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

// Get initial state from localStorage
const getInitialState = (): AuthState => {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")
    
    return {
        user: user ? JSON.parse(user) : null,
        token: token || null,
        isAuthenticated: !!token
    }
}

const initialState : AuthState = getInitialState()

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        setUser: (state, action) => {
            state.user = action.payload
            state.isAuthenticated = true
            localStorage.setItem("user", JSON.stringify(action.payload))
        },
        setToken: (state, action) => {
            state.token = action.payload
            localStorage.setItem("token", action.payload)
        },
        logout: (state) => {
            state.user = null
            state.token = null
            state.isAuthenticated = false
            localStorage.removeItem("user")
            localStorage.removeItem("token")
        }
    }
})

export const {setUser, setToken, logout} = authSlice.actions
export default authSlice.reducer