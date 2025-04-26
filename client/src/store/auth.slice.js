import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import Axios from '../utils/Axios';
import summery from '../utils/summery';
import { catchAsync, handleLoadingErrorParamsForAsycThunk, reduxToolKitCaseBuilder } from '../utils/errorHandler';

const initialState = {
    user: {
        data: null,
    },
    errors: {},
    loadings: {},
    errorMessages: {},
    errorCodes: {},
    paramsForThunk: {},
}

export const loginWithEmailPassword = createAsyncThunk(
    'auth/loginWithEmailPassword',
    catchAsync(async ({ email, password }, api) => {
        const response = await Axios({
            ...summery.login,
            data: { email, password }
        })
        return response.data
    })
)

export const signupWithEmailPassword = createAsyncThunk(
    'auth/signupWithEmailPassword',
    catchAsync(async ({ email, password }, api) => {
        const response = await Axios({
            ...summery.signup,
            data: { email, password }
        })
        return response.data
    })
)

export const getCurrenUser = createAsyncThunk(
    'auth/getCurrenUser',
    catchAsync(async (_, api) => {
        const response = await Axios({
            ...summery.getUser
        })
        return response.data
    })
);

export const logout = createAsyncThunk(
    'auth/logout',
    catchAsync(async (_, api) => {
        const response = await Axios({
            ...summery.logout
        })
        return response.data;
    })
)

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    catchAsync(async ({ email }, api) => {
        const response = await Axios({
            ...summery.forgotPassword,
            data: { email }
        })
        return response.data
    })
)

export const resetPassword = createAsyncThunk(
    'user/resetPassword',
    catchAsync(async ({ token, password }, api) => {
            const response = await Axios({
                ...summery.resetPassword,
                data: {
                    resetToken: token,
                    password
                }
            })
            return response.data
    })
)

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCurrenUser.fulfilled, (state, action) => {
                // console.log("you are login fullfilled",action.payload)
                state.user = {
                    data: action.payload?.data,
                };

            })
            .addCase(loginWithEmailPassword.fulfilled, (state, action) => {
                state.user = {
                    data: action.payload.data,
                };
            })
            .addCase(signupWithEmailPassword.fulfilled, (state, action) => {
                state.user = {
                    data: null,
                };
            })
            .addCase(logout.fulfilled, (state, action) => {
                // console.log("logout fullfilled")
                    state.user = {
                        data: null,
                    }
            })
            .addMatcher(
                isAnyOf(
                    ...reduxToolKitCaseBuilder([
                        loginWithEmailPassword,
                        signupWithEmailPassword,
                        getCurrenUser,
                        logout,
                        forgotPassword,
                        resetPassword
                    ])
                ),
                handleLoadingErrorParamsForAsycThunk
            )
    },
});


export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;