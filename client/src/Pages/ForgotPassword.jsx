import * as yup from "yup";
import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../store/auth.slice";
import toast, { Toaster } from "react-hot-toast";

const SignupSchema = yup
  .object({
    email: yup.string().email("Invalid email format").required(),
  })
  .required();
const ForgotPassword = () => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SignupSchema),
  });

  const handleForm = async (data) => {
    const response = await dispatch(forgotPassword(data));
    if (response.payload?.success) {
      toast.success(response.payload.message);
    }
  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center bg-slate-100">
      <div className=" bg-white p-4 w-full max-w-[400px] rounded border border-slate-100 shadow-md">
        <h1 className="text-2xl font-bold text-center text-[#5d738c]">
          Forgot Password 🧑
        </h1>
        <form
          onSubmit={handleSubmit(handleForm)}
          className="flex flex-col gap-4 mx-auto mt-10"
        >
          <div className="grid gap-1">
            <label
              className="text-sm text-shadow-slate-800 cursor-pointer capitalize"
              htmlFor="email"
            >
              email
            </label>
            <input
              {...register("email")}
              id="email"
              name="email"
              className="border rounded border-slate-200 px-2 py-2 outline-none text-base"
              placeholder="Enter Email"
            />
            {errors.email && (
              <p className="px-2 text-sm text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>
          <button className="bg-[#667a91] hover:bg-[#5d738c] cursor-pointer transition-all text-white rounded-md px-4 py-2">
            Send
          </button>
        </form>
      </div>
      <Toaster />
    </div>
  );
};

export default ForgotPassword;
