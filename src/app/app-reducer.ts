import {Dispatch} from 'redux'
import {authAPI} from 'api/todolists-api'
import {authActions} from "features/auth/auth.reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        },
        setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setAppInitialized: (state, action: PayloadAction<{ appInitialized: boolean }>) => {
            state.isInitialized = action.payload.appInitialized
        }
    }
})

export const appReducer = slice.reducer
export const appActions = slice.actions

// export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
// export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
// export const setAppInitializedAC = (value: boolean) => ({type: 'APP/SET-IS-INITIALIED', value} as const)

export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(authActions.setIsLoggedIn({isLoggedIn: true}));
        } else {

        }
        dispatch(appActions.setAppInitialized({appInitialized:true}));
    })
}

// export type SetAppErrorActionType = ReturnType<typeof setAppError>
// export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppInitialStateType = typeof initialState
// type ActionsType =
//     | SetAppErrorActionType
//     | SetAppStatusActionType
//     | ReturnType<typeof setAppInitializedAC>
