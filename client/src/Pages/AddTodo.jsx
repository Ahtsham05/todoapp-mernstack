import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, editTodo, uploadImage } from "../store/todo.slice";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const TodoSchema = yup
  .object({
    title: yup.string().required(),
    description: yup.string().required(),
    status: yup.string().required(),
    due_date: yup.date().when("status", (status, schema) => {
      if (status[0] === "in-progress") {
        return schema.min(new Date(), "Due date cannot be in the past for in-progress tasks").required();
      }
      return schema.required();
    }),
    tag: yup.string().required(),
    assigned_to: yup.string().required(),
    reminder: yup.date(),
    repeat: yup.string().required().default("none"),
    notes: yup.string().required(),
    achive: yup.string().required(),
    attachments: yup.mixed().default(""),
  })
  .required();

const getCurrentDateTimeLocal = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
};

const AddTodo = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isEditMode, setIsEditMode] = useState(false);
  const today = getCurrentDateTimeLocal();
  const state = useSelector(state => state.todo)
  const todos = state?.todoStore;
  const createTodo = state?.loadings?.addTodo;
  const editTodoState = state.loadings?.editTodo;
  const [attachments, setAttachments] = useState(null);

  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues:{
      status: "in-progress",
    },
    resolver: yupResolver(TodoSchema),
  });

  const formatDateTimeLocal = (dateString) => {
    const date = new Date(dateString);
    const pad = (n) => (n < 10 ? "0" + n : n);

    const yyyy = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const mm = pad(date.getMinutes());

    return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
  };

  const status = watch("status");

  useEffect(() => {
    if (id) {
      const todoToEdit = todos.find((todo) => todo._id === id);
      if (todoToEdit) {
        Object.entries(todoToEdit).forEach(([key, value]) => {
          if (key === "due_date" || key === "reminder") {
            setValue(key, formatDateTimeLocal(value));
            return;
          } 
          if (key === "attachments") {
            setAttachments(value);
            return;
          } 
          setValue(key, value);
        });
        setIsEditMode(true);
      }
    }
  }, [id, todos, setValue]);

  const handleForm = async (data) => {
    if (isEditMode) {
      const newData = {
        ...data,
        attachments: data.attachments[0] || attachments,
        reminder: new Date(data.reminder).toISOString(),
        due_date: new Date(data.due_date).toISOString(),
      };
      const response = await dispatch(editTodo(newData));
      if (response.payload.success) {
        toast.success(response.payload.message);
        setAttachments(null);
      }
      navigate(`/list`);
    } else {
      const newTodo = {
        ...data,
        created_at: new Date().toISOString(),
        attachments: data.attachments[0],
        reminder: new Date(data.reminder).toISOString(),
        due_date: new Date(data.due_date).toISOString(),
      };
      // console.log("newTodo",newTodo)
      const response = await dispatch(addTodo(newTodo));
      if (response.payload.success) {
        toast.success(response.payload.message);
      }
      reset();
    }
    setIsEditMode(false);
  };
  // console.log("attchments",attachments)
  const fileHandler = async (e) => {
    const image = e.target.files[0];
    if (!image) {
      return;
    }
    const formData = new FormData();
    formData.append("image", image);

    try {
      setAttachmentsLoading(true);
      const upload = await dispatch(uploadImage(formData));
      if (uploadImage.fulfilled.match(upload)) {
        setAttachments(upload.payload.data?.url);
        toast.success(upload.payload.message);
        setAttachmentsError(false);
      }
      if (uploadImage.rejected.match(upload)) {
        setAttachments("");
        toast.error(upload.payload.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setAttachmentsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="p-4 bg-white rounded border border-slate-100">
        <h1 className="font-bold text-xl text-[#667a91] my-4">
          / {id ? "Edit" : "Add"}
        </h1>
        <form
          onSubmit={handleSubmit(handleForm)}
          className="grid grid-cols-1 lg:grid-cols-2 gap-2"
        >
          <div className="grid gap-1">
            <label
              className="text-sm text-shadow-slate-800 cursor-pointer capitalize"
              htmlFor="title"
            >
              Title
            </label>
            <input
              {...register("title")}
              id="title"
              name="title"
              className="border rounded border-slate-200 px-2 py-2 outline-none text-base"
              placeholder="Enter todo title.."
            />
            {errors.title && (
              <p className="px-2 text-sm text-red-400">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <label
              className="text-sm text-shadow-slate-800 cursor-pointer capitalize"
              htmlFor="description"
            >
              description
            </label>
            <input
              {...register("description")}
              name="description"
              id="description"
              className="border rounded border-slate-200 px-2 py-2 outline-none text-base"
              placeholder="Enter todo description.."
            />
            {errors.description && (
              <p className="px-2 text-sm text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <label
              className="text-sm text-shadow-slate-800 cursor-pointer capitalize"
              htmlFor="status"
            >
              status
            </label>
            <select
              {...register("status")}
              name="status"
              id="status"
              className="border rounded border-slate-200 px-2 py-2 outline-none text-base"
            >
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            {errors.status && (
              <p className="px-2 text-sm text-red-400">
                {errors.status.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <label
              className="text-sm text-shadow-slate-800 cursor-pointer capitalize"
              htmlFor="tag"
            >
              tag
            </label>
            <select
              {...register("tag")}
              name="tag"
              id="tag"
              className="border rounded border-slate-200 px-2 py-2 outline-none text-base"
            >
              <option value="">Select Tag</option>
              <option value="work">Work</option>
              <option value="report">Report</option>
            </select>
            {errors.tag && (
              <p className="px-2 text-sm text-red-400">{errors.tag.message}</p>
            )}
          </div>
          <div className="grid gap-1">
            <label
              className="text-sm text-shadow-slate-800 cursor-pointer capitalize"
              htmlFor="due-date"
            >
              due date
            </label>
            <input
              type="datetime-local"
              {...register("due_date")}
              // min={todoStatus === "in-progress" ? today : undefined}
              name="due_date"
              id="due_date"
              className="border rounded border-slate-200 px-2 py-2 outline-none text-base"
              placeholder="Select todo due date.."
            />
            {errors.due_date && (
              <p className="px-2 text-sm text-red-400">
                {errors.due_date.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <label
              className="text-sm text-shadow-slate-800 cursor-pointer capitalize"
              htmlFor="assigned_to"
            >
              assigned_to
            </label>
            <input
              {...register("assigned_to")}
              name="assigned_to"
              id="assigned_to"
              className="border rounded border-slate-200 px-2 py-2 outline-none text-base"
              placeholder="Enter todo assigned to ..."
            />
            {errors.assigned_to && (
              <p className="px-2 text-sm text-red-400">
                {errors.assigned_to.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <label
              className="text-sm text-shadow-slate-800 cursor-pointer capitalize"
              htmlFor="due-date"
            >
              Reminder
            </label>
            <input
              type="datetime-local"
              {...register("reminder")}
              name="reminder"
              id="reminder"
              className="border rounded border-slate-200 px-2 py-2 outline-none text-base"
              placeholder="Select todo Reminder..."
            />
            {errors.reminder && (
              <p className="px-2 text-sm text-red-400">
                {errors.reminder.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <label
              className="text-sm text-shadow-slate-800 cursor-pointer capitalize"
              htmlFor="achive"
            >
              achive
            </label>
            <select
              {...register("achive")}
              name="achive"
              id="achive"
              className="border rounded border-slate-200 px-2 py-2 outline-none text-base"
            >
              <option value="">Select Achive</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {errors.achive && (
              <p className="px-2 text-sm text-red-400">
                {errors.achive.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <label
              className="text-sm text-shadow-slate-800 cursor-pointer capitalize"
              htmlFor="notes"
            >
              notes
            </label>
            <input
              {...register("notes")}
              name="notes"
              id="notes"
              className="border rounded border-slate-200 px-2 py-2 outline-none text-base"
              placeholder="Enter todo notes.."
            />
            {errors.notes && (
              <p className="px-2 text-sm text-red-400">
                {errors.notes.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <label
              className="text-sm text-shadow-slate-800 cursor-pointer capitalize"
              htmlFor="notes"
            >
              Attachments
            </label>
            <input
              {...register("attachments")}
              type="file"
              name="attachments"
              id="attachments"
              className="border rounded border-slate-200 px-2 py-2 outline-none text-base w-full"
            />
            {errors.attachments && (
              <p className="px-2 text-sm text-red-400">
                {errors.attachments.message}
              </p>
            )}
          </div>
          <div>
            {attachments && <img src={attachments} height={40} width={40} />}
          </div>
          <div className="flex flex-col justify-center">
            <button
              className="text-white bg-[#667a91] hover:bg-[#5d738c] transition-all h-fit p-2 flex items-center justify-center rounded cursor-pointer "
              type="submit"
              disabled={createTodo || editTodoState}
            >
              {createTodo || editTodoState ? (
                <Loader2 className="animate-spin size-6" />
              ) : id ? (
                "Update"
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTodo;
