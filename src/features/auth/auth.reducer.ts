import { createSlice } from "@reduxjs/toolkit";
import { appActions } from "app/app-reducer";
import { clearTasksAndTodolists } from "common/actions/common.actions";
import { authAPI, LoginParamsType } from "features/auth/auth.api";
import { ResultCode } from "common/constants";
import { createAppAsyncThunk } from "common/utils";

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>(
  "auth/login",
  async (arg, { rejectWithValue }) => {
    const res = await authAPI.login(arg);
    if (res.data.resultCode === ResultCode.SUCCESS) {
      return { isLoggedIn: true };
    } else {
      const isShowAppError = !res.data.fieldsErrors.length;
      return rejectWithValue({ data: res.data, showGlobalError: isShowAppError });
    }
  }
);

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>("auth/logout", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  const res = await authAPI.logout();
  if (res.data.resultCode === ResultCode.SUCCESS) {
    dispatch(clearTasksAndTodolists());
    return { isLoggedIn: false };
  } else {
    return rejectWithValue({ data: res.data, showGlobalError: true });
  }
});
const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>(
  "auth/initializeApp",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const res = await authAPI.me();
      dispatch(appActions.setAppInitialized({ appInitialized: true }));
      if (res.data.resultCode === ResultCode.SUCCESS) {
        return { isLoggedIn: true };
      } else {
        return rejectWithValue({ data: res.data, showGlobalError: false });
      }
    } finally {
      dispatch(appActions.setAppInitialized({ appInitialized: true }));
    }
  }
);

const slice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      });
  },
});

export const authReducer = slice.reducer;
export const authThunks = { login, logout, initializeApp };
