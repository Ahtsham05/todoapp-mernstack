import mongoose from 'mongoose';
import * as userService from "../services/user.service.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { apiResponse } from "../utils/apiResponse.js"
import { throwIf } from "../utils/throwif.js"


// auth routes will lay under auth service controller valiaditon routes ✅

export const getAllUsers = asyncHandler(async (req, res) => {
    const { pageno = 1, limitno = 10, searchq = "" } = req.query;

    throwIf(req.user.role === "user", "UnAuthorized Access!", 404);

    const page = parseInt(pageno);
    const limit = parseInt(limitno);
    const search = searchq;

    const query = searchq? { email: { $regex: searchq, $options: "i" } } : {};


    const options = {
        page,
        limit,
        sort: { createdAt: -1 },
        select: "-password",
    };

    const result = await userService.getAllUsers(query, options);

    return res.status(200).json(
        new apiResponse(200, "Users Fetched!", {
            users: result.docs,
            page: result.page,
            totalPages: result.totalPages,
            totalResults: result.totalDocs,
        })
    );
});

export const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new apiResponse(200, "Current Logged In User!", req.user)
    )
})

export const updateUserRole = asyncHandler(async (req, res) => {

    throwIf(req.user.role !== "admin", "unAuthorized Access!", 404)

    const userid = req.params.id

    const { role } = req.body

    throwIf(!userid || !role, "All Fields Required!", 404)

    const update = await userService.updateUser(userid, {
        role: role
    })
    throwIf(!update, "Update Failed!", 400)

    return res.status(200).json(
        new apiResponse(200, "Role updated Successfully!", update)
    )
})

export const deleteUser = asyncHandler(async (req, res) => {
    throwIf(req.user.role !== "admin", "unAuthorized Access!", 400)

    const userid = req.params.id
    throwIf(!userid, "All Fields Required!", 400)
    
    throwIf(new mongoose.Types.ObjectId(userid).equals(req.user._id), "You can't delete yourself!", 400)

    const deleted = await userService.deleteUserById(userid)

    return res.status(200).json(
        new apiResponse(200, "Delete User Successfully!", deleted)
    )
})

