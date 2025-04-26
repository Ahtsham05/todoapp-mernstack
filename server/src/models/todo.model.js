import mongoose from "mongoose";
import { Schema } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const todoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    achive : {
        type: String,
        enum: ["yes", "no"],
        required: true,
        default: "no"
    },
    assigned_to:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    attachments: {
        type: String,
        default: null,
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    due_date: {
        type: Date,
        required: [true, "Due date is required"],
    },
    notes: {
        type: String,
        required: true
    },
    reminder: {
        type: String,
        required: true,
    },
    repeat: {
        type: String,
        enum: ["none", "yes"],
        default: "none"
    },
    status: {
        type: String,
        enum: ["in-progress","completed"],
        required: true
    },
    tag: {
        type: String,
        enum: ["work","report"],
        required: true
    },
    uid: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps:true})

todoSchema.plugin(mongoosePaginate);

export const Todo = mongoose.model("Todo",todoSchema)

