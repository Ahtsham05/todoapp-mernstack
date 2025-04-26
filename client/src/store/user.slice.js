import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import Axios from '../utils/Axios'
import summery from '../utils/summery';
import { catchAsync, handleLoadingErrorParamsForAsycThunk, reduxToolKitCaseBuilder } from '../utils/errorHandler';

const initialState = {
    user: {},
    errors: {},
    loadings: {},
    errorMessages: {},
    errorCodes: {},
    paramsForThunk: {},
}

export const fetchAllPaginatedUsers = createAsyncThunk(
    'user/fetchAllPaginatedUsers',
    catchAsync(async ({ pageSize = 10, pageIndex = 1, searchText = "" }, api) => {
        const response = await Axios({
            ...summery.getAllUsers,
            url: `/user?pageno=${pageIndex}&limitno=${pageSize}&searchq=${searchText}`
        })
        const users = response?.data?.data?.users
        const totalPages = response?.data?.data?.totalPages
        const page = response?.data?.data?.page
        const totalResults = response?.data?.data?.totalResults
        return {
            users,
            lastVisible: page,
            hasMore: page < totalPages,
            totalPages,
            totalResults,
        };
    })
);

export const deleteUser = createAsyncThunk(
    'user/deleteUser',
    catchAsync(async (userId, api) => {
        const response = await Axios({
            ...summery.deleteUser,
            url: `/user/${userId}`
        })
        return response.data
    })
)

export const updateRole = createAsyncThunk(
    'user/updateRole',
    catchAsync(async ({ _id, role }, api) => {
        const userId = _id
        const response = await Axios({
            ...summery.roleUpdate,
            url: `/user/${userId}`,
            data: {
                role
            }
        })
        return response.data
    })
)

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllPaginatedUsers.fulfilled, (state, action) => {
                state.user = action.payload
            })
            .addMatcher(
                isAnyOf(
                    ...reduxToolKitCaseBuilder([
                        fetchAllPaginatedUsers,
                        deleteUser,
                        updateRole
                    ])
                ),
                handleLoadingErrorParamsForAsycThunk
            )
    },
});

export const { } = userSlice.actions;

export default userSlice.reducer;