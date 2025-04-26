import { Todo } from '../models/todo.model.js';
import { asyncHandlerWithReturn } from '../utils/asyncHandlerWithReturn.js';
import { throwIf } from '../utils/throwif.js';

export const createTodo = asyncHandlerWithReturn(async (todo) => {
    return await Todo.create(todo)
})

export const updateTodo = asyncHandlerWithReturn(async (id, updateData) => {
  return await Todo.findByIdAndUpdate(id, updateData, { new: true });
});

export const getAllTodos = asyncHandlerWithReturn(async (query,options) => {
  return await Todo.paginate(query, options)
});

export const getAllTodosByUser = asyncHandlerWithReturn(async (query,options) => {
  return await Todo.paginate(query, options)
});

export const getTodoById = asyncHandlerWithReturn(async (id) => {
  return await Todo.findById(id);
});

export const deleteTodoById = asyncHandlerWithReturn(async (id) => {
  const todo = await Todo.findById(id);
  throwIf(!todo, "Todo not found", 404);
  return await todo.deleteOne();
})
