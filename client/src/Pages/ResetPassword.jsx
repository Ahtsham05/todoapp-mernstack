import * as yup from "yup";
import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { resetPassword } from "../store/auth.slice";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const SignupSchema = yup
  .object({
    password: yup
      .string()
      .min(8, "Password should be minmum 8 character!")
      .required(),
    confirmpassword: yup
      .string()
      .min(8, "Confirm Password should be minmum 8 character!")
      .required(),
  })
  .required();
const ResetPassword = () => {
  const navigate = useNavigate();
  const param = useParams();

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SignupSchema),
  });

  const handleForm = async (data) => {
    if (data.password !== data.confirmpassword) {
      toast.error("New Password or Confirm Password Should be Same!");
      return;
    }

    const token = param.token;
    const response = await dispatch(
      resetPassword({ password: data.password, token })
    );
    if (response.payload?.success) {
      toast.success(response.payload.message);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center bg-slate-100">
      <div className=" bg-white p-4 w-full max-w-[400px] rounded border border-slate-100 shadow-md">
        <h1 className="text-2xl font-bold text-center text-[#5d738c]">
          Reset Password 🧑
        </h1>
        <form
          onSubmit={handleSubmit(handleForm)}
          className="flex flex-col gap-4 mx-auto mt-10"
        >
          <div className="grid gap-1">
            <label
              className="text-sm text-shadow-slate-800 cursor-pointer capitalize"
              htmlFor="password"
            >
              New password
            </label>
            <input
              {...register("password")}
              id="password"
              name="password"
              className="border rounded border-slate-200 px-2 py-2 outline-none text-base"
              placeholder="Enter new password"
            />
            {errors.password && (
              <p className="px-2 text-sm text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <label
              className="text-sm text-shadow-slate-800 cursor-pointer capitalize"
              htmlFor="confirmpassword"
            >
              Confirm password
            </label>
            <input
              {...register("confirmpassword")}
              id="confirmpassword"
              name="confirmpassword"
              className="border rounded border-slate-200 px-2 py-2 outline-none text-base"
              placeholder="Enter confirm password"
            />
            {errors.confirmpassword && (
              <p className="px-2 text-sm text-red-400">
                {errors.confirmpassword.message}
              </p>
            )}
          </div>
          <button className="bg-[#667a91] hover:bg-[#5d738c] cursor-pointer transition-all text-white rounded-md px-4 py-2">
            Reset Password
          </button>
        </form>
      </div>
      <Toaster />
    </div>
  );
};

export default ResetPassword;
