import { Router } from "express";
import { deleteUser, getAllUsers, getCurrentUser, updateUserRole } from "../controllers/index.js";
import { auth } from "../middlewares/auth.middleware.js";
import { getAllUsersSchema, updateUserRoleSchema, userIdSchema } from "../validations/user.validation.js";
import { validate } from "../middlewares/validate.middleware.js";
import { actions, resources } from "../config/roles.js";

const userRoute = Router()

//Protected Routes
userRoute.route("")
    .get(auth(actions.manage, resources.all), validate({query : getAllUsersSchema}),getAllUsers)

userRoute.route("/:id")
    .delete(auth(actions.manage, resources.all), validate({params : userIdSchema}), deleteUser)
    .patch(auth(actions.manage, resources.all), validate({params : userIdSchema}), validate({body : updateUserRoleSchema}), updateUserRole)

userRoute.route("/get")
    .get(auth(actions.readRelated, resources.user), getCurrentUser)


export default userRoute


//get All user
/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags:
 *       - Users
 *       - Admin
 *     description: Returns a paginated list of all users. Only accessible to admin users with the "manage" permission.
 *     parameters:
 *       - in: query
 *         name: pageno
 *         schema:
 *           type: string
 *         required: true
 *         description: Page number
 *       - in: query
 *         name: limitno
 *         schema:
 *           type: string
 *         required: true
 *         description: Number of users per page
 *       - in: query
 *         name: searchq
 *         schema:
 *           type: string
 *         required: false
 *         description: Optional search query to filter users
 *     responses:
 *       200:
 *         description: A list of users
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — admin access required
 */

//delete user
/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags:
 *       - Users
 *       - Admin
 *     description: Deletes a user by ID. Only accessible by admins.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — admin access required
 *       404:
 *         description: User not found
 */

//update role
/**
 * @swagger
 * /user/{id}:
 *   patch:
 *     summary: Update user role (Admin only)
 *     tags:
 *       - Users
 *       - Admin
 *     description: Updates the role of a user. Only accessible by admins.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 example: "admin"
 *             required:
 *               - role
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         description: Invalid request body or user ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — admin access required
 *       404:
 *         description: User not found
 */


//getcurrent user
/**
* @swagger
* /user/get:
*   get:
*     summary: Get current logged-in user
*     tags:
*       - Users
*     description: Returns the profile of the currently authenticated user. Requires a valid access token.
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Returns the user data
*       401:
*         description: Unauthorized — access token missing or invalid
*/
