import { User } from '../models/user.model.js';
import { asyncHandlerWithReturn } from '../utils/asyncHandlerWithReturn.js';
import { throwIf } from '../utils/throwif.js';

export const findOneUser = asyncHandlerWithReturn(async (value)=>{
  return await User.findOne(value)
})

export const getUserById = asyncHandlerWithReturn(async (id) => {
  return await User.findById(id).select("-password -otp -otp_expiry");
});

export const updateUser = asyncHandlerWithReturn(async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
});

export const getAllUsers = asyncHandlerWithReturn(async (query,options) => {
  return await User.paginate(query, options)
});

export const getTotallUserDocuments = asyncHandlerWithReturn(async (filter = {}) => {
  return await User.countDocuments(filter)
})

export const deleteUserById = asyncHandlerWithReturn(async (id) => {
  const user = await User.findById(id);
  throwIf(!user, "User not found", 404);
  return await user.deleteOne();
})

export const updateUserPassword = asyncHandlerWithReturn(async (_id, newPassword) => {
  const user = await User.findById(_id)
  user.password = newPassword;
  return await user.save({validateBeforeSave: true})
})
