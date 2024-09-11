import { createReducer, on } from "@ngrx/store"
import { loadUserprofileFailure, loaduserProfileSuccess, updateUserProfileFailure, updateUserprofilesuccess } from "./user.action"



export interface UserState{
    user:any,
    error:any
}

export const initialState: UserState={
    user:null,
    error:null
}


export const userReducer = createReducer(
    initialState,
    on(loaduserProfileSuccess ,(state, {user})=>({
        ...state,
        user,
        error:null
    } )),

    on(loadUserprofileFailure , (state, {error})=>({
        ...state,
        error
    })),

    on(updateUserprofilesuccess , (state , {user})=>({
        ...state,
        user,
        error:null
    })),

    on(updateUserProfileFailure , (state , {error})=>({
        ...state,
        error
    }))
)