import { Router } from "express";
import { getAllChartData, getAllPieData, getChartData, getPieData, getTodosDetailByUser, getTotallTodos } from "../controllers/index.js";
import { auth } from "../middlewares/auth.middleware.js";
import { actions, resources } from "../config/roles.js";

const dashboardRoute = Router()

dashboardRoute.get("/singleuserbarchart", auth(actions.readRelated, resources.todo), getChartData)
dashboardRoute.get("/getalluserbarchart", auth(actions.manage, resources.all), getAllChartData)

dashboardRoute.get("/getpiechart", auth(actions.readRelated, resources.todo), getPieData)
dashboardRoute.get("/getallpiechart", auth(actions.manage, resources.all), getAllPieData)

dashboardRoute.get("/gettotaltodos", auth(actions.manage, resources.all), getTotallTodos)
dashboardRoute.get("/gettotal-todosuser", auth(actions.readRelated, resources.todo), getTodosDetailByUser)

export default dashboardRoute



// catch async thunk ✅
// dynamic store slice ✅
// app crash ✅
// forbidden show frontend ✅
// apply swagger ✅

//single userbar chart
/**
 * @swagger
 * /dashboard/singleuserbarchart:
 *   get:
 *     summary: Get bar chart data for a specific user
 *     tags: [Dashboard]
 *     description: Fetches bar chart data for a specific user. Requires read-related permission.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bar chart data for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chartData:
 *                   type: array
 *                   description: Data points for the bar chart
 *       400:
 *         description: Bad request (e.g., missing userId)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */


//getalluserbarchart
/**
 * @swagger
 * /dashboard/getalluserbarchart:
 *   get:
 *     summary: Get bar chart data for all users
 *     tags: [Dashboard]
 *     description: Fetches bar chart data for all users. Requires admin access.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bar chart data for all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chartData:
 *                   type: array
 *                   description: Data points for the bar chart for all users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — insufficient permissions
 *       500:
 *         description: Server error
 */


//getpiechart
/**
 * @swagger
 * /dashboard/getpiechart:
 *   get:
 *     summary: Get pie chart data
 *     tags: [Dashboard]
 *     description: Fetches pie chart data based on todo statistics. Requires read-related permission.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pie chart data for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chartData:
 *                   type: array
 *                   description: Data points for the pie chart
 *       400:
 *         description: Bad request (e.g., missing userId)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */


//getallpiechart
/**
 * @swagger
 * /dashboard/getallpiechart:
 *   get:
 *     summary: Get pie chart data for all users
 *     tags: [Dashboard]
 *     description: Fetches pie chart data for all users. Requires admin access.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pie chart data for all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chartData:
 *                   type: array
 *                   description: Data points for the pie chart for all users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — insufficient permissions
 *       500:
 *         description: Server error
 */


//gettotaltodos
/**
 * @swagger
 * /dashboard/gettotaltodos:
 *   get:
 *     summary: Get the total number of todos
 *     tags: [Dashboard]
 *     description: Fetches the total number of todos. Requires admin access.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total number of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalTodos:
 *                   type: integer
 *                   description: Total count of todos in the system
 *                 totalInProgress:
 *                   type: integer
 *                   description: Total count of in-progress todos in the system
 *                 totalCompleted:
 *                   type: integer
 *                   description: Total count of completed todos in the system
 *                 totalUsers:
 *                   type: integer
 *                   description: Total count of users in the system
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — insufficient permissions
 *       500:
 *         description: Server error
 */


//gettotal-todosuser
/**
 * @swagger
 * /dashboard/gettotal-todosuser:
 *   get:
 *     summary: Get the total number of todos for a specific user
 *     tags: [Dashboard]
 *     description: Fetches the total number of todos assigned to a specific user. Requires read-related permission.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total number of todos for the specific user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalTodosForUser:
 *                   type: integer
 *                   description: Total count of todos for the specified user
 *                 totalInProgressForUser:
 *                   type: integer
 *                   description: Total count of in-progress todos for the specified user
 *                 totalCompletedForUser:
 *                   type: integer
 *                   description: Total count of completed todos for the specified user
 *       400:
 *         description: Bad request (e.g., missing userId)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — insufficient permissions
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */