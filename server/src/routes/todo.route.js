import { Router } from "express";
import { createTodo, deleteTodo, editTodo, getAllTodos, getAllTodosByUser, getTodoById, uploadImage } from "../controllers/index.js";
import { auth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { getAllTodosSchema, todoIdSchema, todoSchema } from "../validations/todo.validation.js";
import { resources, actions } from "../config/roles.js";
const todoRoute = Router()


// todoRoute.use(auth)

todoRoute.route("")
    .post(auth(actions.create,resources.todo) ,upload.single("attachments"), validate({body : todoSchema}),  createTodo)
    .get(auth(actions.manage, resources.all) ,validate({query : getAllTodosSchema}),getAllTodos)

todoRoute.route("/get")
    .get(auth(actions.readRelated, resources.todo), validate({query : getAllTodosSchema}),getAllTodosByUser)

todoRoute.route("/:id")
    .get(auth(actions.read,resources.todo) ,validate({params : todoIdSchema}),getTodoById)
    .patch(auth(actions.update, resources.todo) , upload.single("attachments"), validate({params : todoIdSchema}),validate({body : todoSchema}),editTodo)
    .delete(auth(actions.delete, resources.todo),validate({params : todoIdSchema}),deleteTodo)

todoRoute.post("/upload",upload.single("image"),uploadImage)

export default todoRoute

//create todo
/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Create a new todo
 *     tags:
 *       - Todos
 *     description: Create a todo with required fields. Requires authentication and `create` permission on todos.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - status
 *               - due_date
 *               - tag
 *               - assigned_to
 *               - repeat
 *               - notes
 *               - achive
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 example: "in-progress"
 *               due_date:
 *                 type: string
 *                 format: date
 *               tag:
 *                 type: string
 *               assigned_to:
 *                 type: string
 *               reminder:
 *                 type: string
 *                 format: date
 *               repeat:
 *                 type: string
 *                 default: "none"
 *               notes:
 *                 type: string
 *               achive:
 *                 type: string
 *               attachments:
 *                 type: string
 *                 description: Optional file URL or name
 *     responses:
 *       201:
 *         description: Todo created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

// get All todos
/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Get all todos (paginated)
 *     tags:
 *       - Todos
 *     description: |
 *       Returns a list of todos with pagination.
 *       Only accessible to users with `manage` permission on all resources (typically admin or manager roles).
 *     security:
 *       - bearerAuth: []
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
 *         description: Number of todos per page
 *       - in: query
 *         name: searchq
 *         schema:
 *           type: string
 *         required: false
 *         description: Optional search keyword
 *     responses:
 *       200:
 *         description: Returns list of todos
 *       401:
 *         description: Unauthorized – token missing or invalid
 *       403:
 *         description: Forbidden – user lacks permission to access this resource
 */

// get login user todos
/**
 * @swagger
 * /todos/get:
 *   get:
 *     summary: Get todos for the logged-in user (paginated)
 *     tags:
 *       - Todos
 *     description: |
 *       Returns a paginated list of todos that belong to the authenticated user.
 *       Requires `readRelated` permission on the todo resource.
 *     security:
 *       - bearerAuth: []
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
 *         description: Number of todos per page
 *       - in: query
 *         name: searchq
 *         schema:
 *           type: string
 *         required: false
 *         description: Optional search keyword
 *     responses:
 *       200:
 *         description: Returns list of todos for the logged-in user
 *       401:
 *         description: Unauthorized – token missing or invalid
 *       403:
 *         description: Forbidden – insufficient permissions
 */

// get todo by id
/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: Get todo by ID
 *     tags: [Todos]
 *     description: Returns a todo by ID. Requires read access.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Single todo object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Todo not found
 */

//Update Todo
/**
 * @swagger
 * /todos/{id}:
 *   patch:
 *     summary: Update todo by ID
 *     tags: [Todos]
 *     description: Updates a todo by ID. Requires update access.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       200:
 *         description: Todo updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Todo not found
 */

//Delete Todo
/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Delete todo by ID
 *     tags: [Todos]
 *     description: Deletes a todo. Requires delete access.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Todo not found
 */

//upload image
/**
 * @swagger
 * /todos/upload:
 *   post:
 *     summary: Upload an image for a todo
 *     tags: [Todos]
 *     description: Uploads an image for a specific todo. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: Bad request (e.g., missing image or incorrect file format)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
