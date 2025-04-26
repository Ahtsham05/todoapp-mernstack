import * as yup from "yup";
import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { loginWithEmailPassword } from "../store/auth.slice";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import googleLogo from "../assets/google.png";

const SignupSchema = yup
  .object({
    email: yup.string().email("Invalid email format").required(),
    password: yup
      .string()
      .min(8, "Password should be minmum 8 character!")
      .required(),
  })
  .required();
const Login = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SignupSchema),
  });

  const handleForm = async (data) => {
    const action = await dispatch(loginWithEmailPassword(data));
    if (action.payload.success) {
      localStorage.setItem("accessToken", action.payload?.data?.accessToken);
      localStorage.setItem("refreshToken", action.payload?.data?.refreshToken);
      toast.success(action.payload.message);
    }
  };

  const signupWithGoogle = () => {
    window.location.href = "http://localhost:8000/api/v1/auth/google/callback";
  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center bg-slate-100">
      <div className=" bg-white p-4 w-full max-w-[400px] rounded border border-slate-100 shadow-md">
        <h1 className="text-2xl font-bold text-center text-[#5d738c]">
          Login 🧑
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
          <div className="grid gap-1">
            <label
              className="text-sm text-shadow-slate-800 cursor-pointer capitalize"
              htmlFor="password"
            >
              password
            </label>
            <input
              {...register("password")}
              id="password"
              name="password"
              className="border rounded border-slate-200 px-2 py-2 outline-none text-base"
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="px-2 text-sm text-red-400">
                {errors.password.message}
              </p>
            )}
            <Link to={"/forgotpassword"} className="text-blue-900">
              Forgot Password?
            </Link>
          </div>
          <button className="bg-[#667a91] hover:bg-[#5d738c] cursor-pointer transition-all text-white rounded-md px-4 py-2">
            Login
          </button>
        </form>
        <div className="grid">
          <div className="relative w-full">
            <p className="text-center my-5 border-t border-b border-slate-200"></p>
            <p className="text-center bg-white p-1 px-4 text-sm text-slate-500 absolute top-[50%] right-[37%] left[50%] -translate-[50%]">
              Or
            </p>
          </div>
          <button
            className="bg-white border shadow-sm text-slate-900 border-slate-200 hover:bg-slate-100 cursor-pointer transition-all rounded-md px-4 py-2 flex items-center gap-2 justify-center"
            onClick={() => signupWithGoogle()}
          >
            <img src={googleLogo} alt="G" className="size-6" />
            <span>Login with Google </span>
          </button>
        </div>
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link to={"/signup"} className="text-[#667a91] hover:text-[#5d738c]">
            Signup
          </Link>
        </p>
      </div>
      <Toaster />
    </div>
  );
};

export default Login;
