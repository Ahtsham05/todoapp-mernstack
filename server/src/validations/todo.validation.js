import * as yup from 'yup';

export const todoSchema = yup.object({
    title: yup.string().required(),
    description: yup.string().required(),
    status: yup.string().required(),
    due_date: yup.date().required(),
    tag: yup.string().required(),
    assigned_to: yup.string().required(),
    reminder: yup.date(),
    repeat: yup.string().required().default("none"),
    notes: yup.string().required(),
    achive: yup.string().required(),
    attachments: yup.mixed().default(""),   
});

export const todoIdSchema = yup.object({
    id: yup.string().required()
})

export const getAllTodosSchema = yup.object({
    pageno: yup.string().required(),
    limitno: yup.string().required(),
    searchq: yup.string()
});