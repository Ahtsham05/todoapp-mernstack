import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import { createAsyncThunk, } from '@reduxjs/toolkit'
import Axios from '../utils/Axios.js';
import summery from '../utils/summery.js';
import { catchAsync, handleLoadingErrorParamsForAsycThunk, reduxToolKitCaseBuilder } from '../utils/errorHandler.js';

const initialState = {
    todoStore: [],
    errors: {},
    loadings: {},
    errorMessages: {},
    errorCodes: {},
    paramsForThunk: {},
}

export const addTodo = createAsyncThunk(
    'todo/addTodo',
    catchAsync(async (todo, api) => {
        const response = await Axios({
            ...summery.createTodo,
            data: todo,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    })
)

export const editTodo = createAsyncThunk(
    'todo/editTodo',
    catchAsync(async (todo, api) => {
        // console.log("editTodo",todo)
        const response = await Axios({
            ...summery.editTodo,
            url: `/todos/${todo._id}`,
            data: todo,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    })
)

export const deleteTodo = createAsyncThunk(
    'todo/deleteTodo',
    catchAsync(async (id, api) => {
        const response = await Axios({
            ...summery.deleteTodo,
            url: `/todos/${id}`
        });
        return response?.data;
    })
)

export const fetchPaginatedTodos = createAsyncThunk(
    'todo/fetchPaginatedTodos',
    catchAsync(async ({ pageSize = 10, pageIndex = 1, searchText = "", userRole }, api) => {
        let response;
        if (userRole === "admin") {
            response = await Axios({
                ...summery.getAllTodos,
                url: `/todos?pageno=${pageIndex}&limitno=${pageSize}&searchq=${searchText}`
            })
        } else {
            response = await Axios({
                ...summery.getAllTodos,
                url: `/todos/get?pageno=${pageIndex}&limitno=${pageSize}&searchq=${searchText}`
            })
        }
        return response?.data
    })
);

export const uploadImage = createAsyncThunk(
    'todo/uploadImage',
    catchAsync(async (formData, api) => {
        const response = await Axios({
            ...summery.upload,
            data: formData
        })
        return response.data
    })
)

export const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder.addCase(editTodo.fulfilled, (state, action) => {
            state.todoStore = state.todoStore.map((todo) =>
                todo._id === action.payload.data?._id
                    ? { ...todo, ...action.payload }
                    : todo
            );
        })

        builder.addCase(fetchPaginatedTodos.fulfilled, (state, action) => {
            state.todoStore = [...action.payload?.data?.todos]
        })

            .addMatcher(
                isAnyOf(
                    ...reduxToolKitCaseBuilder([
                        addTodo,
                        editTodo,
                        deleteTodo,
                        fetchPaginatedTodos,
                    ])
                ),
                handleLoadingErrorParamsForAsycThunk
            );
    }
})

export const { setTodos } = todoSlice.actions

export default todoSlice.reducer