import jwt from "jsonwebtoken"
import * as userService from "../services/user.service.js"
import * as authService from "../services/auth.service.js"
import { sendOtp } from "../utils/sendOtp.js"
import { generateOTP, getOtpExpiry, isOtpValid } from "../utils/otpGenerator.js"
import { sendForgotPasswordEmail } from "../utils/sendForgotPassword.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { apiResponse } from "../utils/apiResponse.js"
import { throwIf } from "../utils/throwif.js"

export const signupUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    const otp = generateOTP(6)

    const otp_expiry = getOtpExpiry(10)

    const newUser = await authService.createUser({
        email,
        password,
        otp,
        otp_expiry
    })
    throwIf(!newUser, "User Creation failed!", 400)

    const sendMail = await sendOtp({ email, otp })
    throwIf(sendMail?.id, "Verification email sending error!", 400)


    return res.status(200).json(
        new apiResponse(200, "user created successfully!", newUser)
    )
})

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const userExisted = await userService.findOneUser({ email })
    throwIf(!userExisted, "Account not found!", 404)

    const match = await userExisted.isPasswordMatch(password)
    throwIf(!match, "Invalid Credentials!", 404)


    const payload = {
        id: userExisted?._id
    }
    const accessToken = jwt.sign(payload, process.env.JWTSECRET, { expiresIn: '1d' })
    const refreshToken = jwt.sign(payload, process.env.JWTSECRET, { expiresIn: '7d' })

    const data = {
        _id: userExisted._id,
        email: userExisted.email,
        role: userExisted.role,
        verified: userExisted.verified,
        facebookId: userExisted.facebookId,
        accessToken,
        refreshToken
    }

    const Options = {
        httpOnly: true,
        secure: true,
        sameSite: false,
    }
    return res.cookie("accessToken", accessToken, Options).cookie("refreshToken", refreshToken, Options).status(200).json(
        new apiResponse(200, "Login SuccessFully!", data)
    )
})

export const otpVerification = asyncHandler(async (req, res) => {
    const { email, otp } = req.body

    const user = await userService.findOneUser({ email })
    throwIf(otp !== user?.otp, "Invalid Credentials!", 404)

    const valid = isOtpValid(user?.otp_expiry)
    throwIf(!valid, "OTP is Expired!", 400)


    const update = await userService.updateUser(user?._id, { verified: true })
    throwIf(!update, "Verification Error!", 400)

    return res.status(200).json(
        new apiResponse(200, "Verification Successfully!", update)
    )
})

export const logoutUser = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: false,
    }
    return res.clearCookie("accessToken", options).clearCookie("refreshToken", options).status(200).json(
        new apiResponse(200, "Logout Successfully!", null)
    )
})

export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body

    const existed = await userService.findOneUser({ email })
    throwIf(!existed, "Email is not Found!", 400)

    const token = jwt.sign({ id: existed?._id }, process.env.JWTSECRET, { expiresIn: '15m' })

    const sendMail = await sendForgotPasswordEmail({ email, token })
    throwIf(!sendMail?.id, "Email sending Error!", 400)

    return res.status(200).json(
        new apiResponse(200, "Email sent successfully, check your mail box !", null)
    )
})

export const resetPassword = asyncHandler(async (req, res) => {
    const { resetToken, password } = req.body

    const decode = jwt.verify(resetToken, process.env.JWTSECRET)

    const existed = await userService.findOneUser({ _id: decode.id })
    throwIf(!existed, "Invalid User!", 404)

    const updatedPassword = await userService.updateUserPassword(existed?._id, password)
    console.log("updatedPassword ========>", updatedPassword)

    return res.status(200).json(
        new apiResponse(200, "Reset Password SuccessFully!", null)
    )
})

export const loginWithGoogle = asyncHandler(async (req, res) => {

    const accessToken = jwt.sign({ id: req.user._id }, process.env.JWTSECRET, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ id: req.user._id }, process.env.JWTSECRET, { expiresIn: '7d' });

    return res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: false,
    }).cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: false,
    })
        .redirect(`${process.env.ORIGIN}/`)
})

export const reLoginUser = asyncHandler(async (req, res) => {

    const token = req?.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "")
    throwIf(!token, "unauthorized Access login!", 401)

    const decode = await jwt.verify(token, process.env.JWTSECRET);
    throwIf(!decode, "invalid token!", 401)

    const user = await userService.findOneUser({ _id: decode.id })
    throwIf(!user, "unauthorized user Access!", 401)

    const accessToken = jwt.sign({ id: user._id }, process.env.JWTSECRET, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWTSECRET, { expiresIn: '7d' });

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: false,
    }

    const data = {
        _id: user._id,
        email: user.email,
        role: user.role,
        verified: user.verified,
        facebookId: user.facebookId,
        googleId: user.googleId,
        accessToken,
        refreshToken
    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
        new apiResponse(200, "Login Successfully!", data)
    )
})
