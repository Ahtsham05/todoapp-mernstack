import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { throwIf } from "../utils/throwif.js"
import * as todoService from "../services/todo.service.js"
import { apiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

export const createTodo = asyncHandler(async (req, res) => {
    const {
        achive, assigned_to, description, due_date,
        notes, reminder, status, tag, title
    } = req.body;

    const userId = req.user._id;
    let uploadResult;
    if (req.file) {
        uploadResult = await uploadOnCloudinary(req.file);
        throwIf(!uploadResult, "File Upload Failed!", 400);
    }

    const todo = await todoService.createTodo({
        achive,
        assigned_to,
        attachments: uploadResult?.secure_url || "",
        description,
        due_date,
        notes,
        reminder,
        status,
        tag,
        title,
        uid: userId,
    });

    throwIf(!todo, "Creation failed!", 400);

    return res.status(200).json(
        new apiResponse(200, "Todo Create Successfully!", todo)
    );
});

export const editTodo = asyncHandler(async (req, res) => {
    const { achive, assigned_to, attachments, description, due_date, notes, reminder, status, tag, title } = req.body

    const _id = req.params.id;

    let uploadResult;
    // console.log("req.file", req.file)
    if (req.file) {
        uploadResult = await uploadOnCloudinary(req.file);
        throwIf(!uploadResult, "File Upload Failed!", 400);
    }

    const update = await todoService.updateTodo(_id, {
        achive, assigned_to, attachments: uploadResult?.secure_url || attachments, description, due_date, notes, reminder, status, tag, title
    });
    throwIf(!update, "Todo not found!", 400)

    return res.status(200).json(
        new apiResponse(200, "Todo Update Successfully!", update)
    )
})

export const getAllTodos = asyncHandler(async (req, res) => {
    const { pageno = 1, limitno = 10, searchq = "" } = req.query;

    const page = parseInt(pageno);
    const limit = parseInt(limitno);
    const search = searchq;

    const query = searchq? { title: { $regex: searchq, $options: "i" } } : {};

    const options = {
        page,
        limit,
        sort: { createdAt: -1 }
    };

    const result = await todoService.getAllTodos(query, options);

    return res.status(200).json(
        new apiResponse(200, "Todos Fetched!", {
            todos: result.docs,
            page: result.page,
            totalPages: result.totalPages,
            totalResults: result.totalDocs,
            hasMore: result.page < result.totalPages
        })
    );
});

export const getAllTodosByUser = asyncHandler(async (req, res) => {
    const { pageno = 1, limitno = 10, searchq = "" } = req.query;

    const page = parseInt(pageno);
    const limit = parseInt(limitno);
    const search = searchq;

    const query = searchq
        ? { title: { $regex: searchq, $options: "i" }, uid: req.user._id }
        : { uid: req.user._id };


    const options = {
        page,
        limit,
        sort: { createdAt: -1 }
    };

    const result = await todoService.getAllTodos(query, options);

    return res.status(200).json(
        new apiResponse(200, "Todos Fetched!", {
            todos: result.docs,
            page: result.page,
            totalPages: result.totalPages,
            totalResults: result.totalDocs,
            hasMore: result.page < result.totalPages
        })
    );
});

export const getTodoById = asyncHandler(async (req, res) => {
    const _id = req.params.id;
    const userId = req.user._id

    const found = await todoService.getTodoById(_id);

    throwIf(!found, "Todo not found!", 400)

    return res.status(200).json(
        new apiResponse(200, "Todo Fetched!", found)
    )
})

export const deleteTodo = asyncHandler(async (req, res) => {
    const _id = req.params.id;
    const userId = req.user._id

    // dont use database direct here make a service file for each model ✅
    const found = await todoService.deleteTodoById(_id);

    return res.status(200).json(
        new apiResponse(200, "Todo Deleted Successfully!", null)
    )
})

export const uploadImage = asyncHandler(async (req, res) => {
    const file = req.file

    throwIf(!file, "File not found!", 400)
    // depricate it use direct in multer ✅
    const uploadResult = await uploadOnCloudinary(file)
    throwIf(!uploadResult, "File Upload Failed!", 400)

    const data = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
    }
    return res.status(200).json(
        new apiResponse(200, "File Upload Successfully!", data)
    );
});
