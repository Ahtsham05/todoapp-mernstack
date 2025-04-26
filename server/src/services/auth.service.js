import { User } from '../models/user.model.js';
import { asyncHandlerWithReturn } from '../utils/asyncHandlerWithReturn.js';
import { throwIf } from '../utils/throwif.js';

export const createUser = asyncHandlerWithReturn(async (userData) => {
  // if email exit return error ✅
  const emailExisted = await User.isEmailTaken(userData.email)
  throwIf(emailExisted, "Email already exist", 400)
  return await User.create(userData);
});