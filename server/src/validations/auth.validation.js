import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup.string().email("Invalid email format").required(),
  password: yup.string().min(8, "Password should be minmum 8 character!").required(),
});

export const SignupSchema = yup.object({
  email: yup.string().email("Invalid email format").required(),
  password: yup.string().min(8, "Password should be minmum 8 character!").required(),
});

export const otpSchema = yup.object({
  otp: yup.string().min(6, "OTP should be minmum 6 character!").required(),
  email: yup.string().email("Invalid email format").required(),
});

export const forgotPasswordSchema = yup.object({
  email: yup.string().email("Invalid email format").required(),
});

export const resetPasswordSchema = yup.object({
  password: yup.string().min(8, "Password should be minmum 8 character!").required(),
  resetToken: yup.string().required(),
});