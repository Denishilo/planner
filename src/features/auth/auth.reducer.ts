import {createSlice} from "@reduxjs/toolkit";
import {appActions} from "app/app-reducer";
import {clearTasksAndTodolists} from "common/actions/common.actions";
import {handleServerNetworkError} from "common/utils/handle-server-network-error";
import {handleServerAppError} from "common/utils/handle-server-app-errors";
import {authAPI, LoginParamsType} from "features/auth/auth.api";
import {ResultCode} from "common/constants";
import {createAppAsyncThunk} from "common/utils";
import {thunkTryCatch} from "common/utils/thunk-try-catch";

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>('auth/login', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
        const res = await authAPI.login(arg)
        if (res.data.resultCode === ResultCode.SUCCESS) {
            return {isLoggedIn: true}
        } else {
            const isShowAppError = !res.data.fieldsErrors.length
            handleServerAppError(res.data, dispatch, isShowAppError);
            return rejectWithValue(res.data)
        }
    })
})

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>('auth/logout', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
        const res = await authAPI.logout()
        if (res.data.resultCode === ResultCode.SUCCESS) {
            dispatch(clearTasksAndTodolists())
            return {isLoggedIn: false}
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }
    })
})
const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>('auth/initializeApp', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
        const res = await authAPI.me()
        dispatch(appActions.setAppInitialized({appInitialized: true}));
        if (res.data.resultCode === ResultCode.SUCCESS) {
            return {isLoggedIn: true}
        } else {
            return rejectWithValue(null)
        }
    })
})

const slice = createSlice({
    name: 'auth',
    initialState: {isLoggedIn: false},
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(initializeApp.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
    }
})

export const authReducer = slice.reducer
export const authThunks = {login, logout, initializeApp}



