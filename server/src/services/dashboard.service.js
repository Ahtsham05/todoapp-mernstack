import { Todo } from '../models/todo.model.js';
import { User } from '../models/user.model.js';
import { asyncHandlerWithReturn } from '../utils/asyncHandlerWithReturn.js';

export const findUserTodos = asyncHandlerWithReturn(async (userid) => {
    return await Todo.find({uid: userid})
})

export const findAllTodos = asyncHandlerWithReturn(async () => {
    return await Todo.find()
})

export const totalCreated = asyncHandlerWithReturn(async () => {
    return await Todo.countDocuments()
})

export const getTotallInProgressTodos = asyncHandlerWithReturn(async () => {
    return await Todo.countDocuments({status : "in-progress"})
})

export const getTotallCompletedTodos = asyncHandlerWithReturn(async () => {
    return await Todo.countDocuments({status : "completed"})
})

export const getTotallUsers = asyncHandlerWithReturn(async () => {
    return await User.countDocuments()
})

export const getTotallTodosByUser = asyncHandlerWithReturn(async (userid) => {
    return await Todo.countDocuments({uid : userid})
})

export const getTotallInProgressTodosByUser = asyncHandlerWithReturn(async (userid) => {
    return await Todo.countDocuments({status : "in-progress", uid : userid})
})

export const getTotallCompletedTodosByUser = asyncHandlerWithReturn(async (userid) => {
    return await Todo.countDocuments({status : "completed", uid : userid})
})