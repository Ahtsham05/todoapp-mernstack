import passport from "passport";
import { Router } from "express";

import { forgotPassword, loginUser, loginWithGoogle, logoutUser, otpVerification, reLoginUser, resetPassword, signupUser } from "../controllers/index.js";
import { authRateLimiter } from "../middlewares/rateLimiter.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { forgotPasswordSchema, loginSchema, otpSchema, resetPasswordSchema, SignupSchema } from "../validations/auth.validation.js";

const authRoute = Router()


// apply req limit for auth apis ✅
// apply yup for validation ✅

authRoute.post("/signup", validate({ body: SignupSchema }), authRateLimiter, signupUser)
authRoute.post("/login", validate({ body: loginSchema }), authRateLimiter, loginUser)
authRoute.get("/logout", authRateLimiter, logoutUser)
authRoute.post("/otp", validate({ body: otpSchema }), authRateLimiter, otpVerification)
authRoute.post("/forgotpassword", validate({ body: forgotPasswordSchema }), authRateLimiter, forgotPassword)
authRoute.post("/reset-password", validate({ body: resetPasswordSchema }), authRateLimiter, resetPassword)
authRoute.get("/login-refresh", authRateLimiter, reLoginUser)

// Google Authentication
authRoute.get(
  "/google/callback",
  passport.authenticate("google", { scope: ["profile", "email"], session: false, failureRedirect: `${process.env.ORIGIN}/login` }), // ✅ session: false
  loginWithGoogle
);

export default authRoute


// signup
/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: User signup
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: strongpassword123
 *     responses:
 *       '200':
 *         description: User registered successfully
 *       '400':
 *         description: Validation or rate limit error
 */


// login
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: strongpassword123
 *     responses:
 *       '200':
 *         description: Login SuccessFully!
 *       '400':
 *         description: Field Validation | Rate limit error *
 *       '404':
 *         description: Account not found | Invalid Credentials!
 */


//logout
/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: User logout
 *     tags: [Auth]
 *     description: Logs out the current user by clearing the cookies or token
 *     responses:
 *       '200':
 *         description: Logout Successfully!
 *       '401':
 *         description: User not authenticated
 *       '429':
 *         description: Rate Limit validator error
 */


//opt verification
/**
 * @swagger
 * /auth/otp:
 *   post:
 *     summary: Verify OTP
 *     tags: [Auth]
 *     description: Verifies the 6-digit OTP sent to the user's email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 pattern: '^[0-9]{6}$'
 *                 example: "123456"
 *     responses:
 *       '200':
 *         description: OTP verified successfully
 *       '400':
 *         description: Invalid OTP or missing fields
 */


//forgot-password
/**
 * @swagger
 * /auth/forgotpassword:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     description: Sends a password reset link to the user's email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       '200':
 *         description: Password reset email sent
 *       '400':
 *         description: Invalid email or user not found
 */


//reset-password
/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     description: Resets the user's password using the reset token link sent via email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resetToken
 *               - password
 *             properties:
 *               resetToken:
 *                 type: string
 *                 description: Token received via email
 *                 example: abc123resetTokenHere
 *               password:
 *                 type: string
 *                 format: password
 *                 description: New password for the account
 *                 example: NewStrongPass123!
 *     responses:
 *       '200':
 *         description: Password reset successful
 *       '400':
 *         description: Invalid or expired reset token
 */


//relogin
/**
 * @swagger
 * /auth/login-refresh:
 *   get:
 *     summary: Refresh user login
 *     tags: [Auth]
 *     description: Issues a new access token using the refresh token. It checks the refresh token from cookies first, then Authorization header.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: false
 *         schema:
 *           type: string
 *         example: Bearer your-refresh-token-here
 *         description: Optional if refreshToken cookie is present
 *     responses:
 *       '200':
 *         description: login successfull!
 *       '401':
 *         description: Unauthorized — missing or invalid refresh token
 *       '500':
 *         description: Server error
 */


//google authentication
/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     description: This route is called by Google after successful authentication. It exchanges the Google token for a local access token and redirects the user to the frontend. Should be triggered by `window.location.href` from the frontend.
 *     responses:
 *       '302':
 *         description: Redirect to frontend after successful login
 *       '401':
 *         description: Failed to authenticate with Google
 */


//  *     parameters:
//  *       - in: query
//  *         name: code
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: Google OAuth code returned after user grants access