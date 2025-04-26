import * as yup from 'yup';

export const getAllUsersSchema = yup.object({
    pageno: yup.string().required(),
    limitno: yup.string().required(),
    searchq: yup.string()
});

export const userIdSchema = yup.object({
    id: yup.string().required()
})

export const updateUserRoleSchema = yup.object({
    role: yup.string().required()
})