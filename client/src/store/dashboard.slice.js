import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import Axios from "../utils/Axios";
import summery from "../utils/summery";
import { catchAsync, handleLoadingErrorParamsForAsycThunk, reduxToolKitCaseBuilder } from "../utils/errorHandler";

const initialState = {
    errors: {},
    loadings: {},
    errorMessages: {},
    errorCodes: {},
    paramsForThunk: {},
}

export const getsingleuserbarchart = createAsyncThunk(
    'dashboard/getsingleuserbarchart',
    catchAsync(async (_, api) => {
        const response = await Axios({
            ...summery.getsingleuserbarchart
        })

        return response.data
    })
)

export const getalluserbarchart = createAsyncThunk(
    'dashboard/getalluserbarchart',
    catchAsync(async (_, id) => {
        const response = await Axios({
            ...summery.getalluserbarchart
        })

        return response.data
    })
)

export const getpiechart = createAsyncThunk(
    'dashboard/getpiechart',
    catchAsync(async (_, id) => {
        const response = await Axios({
            ...summery.getpiechart
        })

        return response.data
    })
)

export const getallpiechart = createAsyncThunk(
    'dashboard/getallpiechart',
    catchAsync(async (_, id) => {
        const response = await Axios({
            ...summery.getallpiechart
        })

        return response.data
    })
)

export const getTotallTodos = createAsyncThunk(
    'dashboard/getTotallTodos',
    catchAsync(async (_, api) => {
        const response = await Axios({
            ...summery.gettotaltodos
        })

        return response.data
    })
)

export const getTotallTodosByUser = createAsyncThunk(
    'dashboard/getTotallTodosByUser',
    catchAsync(async (_, api) => {
        const response = await Axios({
            ...summery.gettotaltodosuser
        })

        return response.data
    })
)



export const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            isAnyOf(
                ...reduxToolKitCaseBuilder([
                    getTotallTodosByUser,
                    getsingleuserbarchart,
                    getalluserbarchart,
                    getpiechart,
                    getallpiechart,
                    getTotallTodos,
                ])
            ),
            handleLoadingErrorParamsForAsycThunk
        )
    }})

export const { } = dashboardSlice.actions

export default dashboardSlice.reducer