import { configureStore } from '@reduxjs/toolkit'
import todoReducer from './todo.slice'
import authReducer from './auth.slice'
import userReducer from './user.slice'
import dashboardReducer from './dashboard.slice'
import handleErrorReducer from './error.slice'

export const store = configureStore({
  reducer: {
    todo : todoReducer,
    auth : authReducer,
    user : userReducer,
    dashboard : dashboardReducer,
    handleErrors: handleErrorReducer
  },
})