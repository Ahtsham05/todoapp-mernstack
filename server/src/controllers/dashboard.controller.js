import { asyncHandler } from "../utils/asyncHandler.js"
import * as dashboardService from "../services/dashboard.service.js"
import { apiResponse } from "../utils/apiResponse.js"


export const getAllChartData = asyncHandler(async (req, res) => {
    const created = Array(7).fill(0);
    const inProgress = Array(7).fill(0);
    const completed = Array(7).fill(0);

    const todos = await dashboardService.findAllTodos();

    todos.forEach(todo => {
      if (!todo.createdAt) return;

      const createdAtDate = new Date(todo.createdAt);
      if (isNaN(createdAtDate)) return;

      const jsDay = createdAtDate.getDay(); // 0 = Sunday, 6 = Saturday
      const dayIndex = (jsDay + 6) % 7; // Adjust to make Monday = 0

      created[dayIndex]++;

      if (todo.status === "in-progress") {
        inProgress[dayIndex]++;
      } else if (todo.status === "completed") {
        completed[dayIndex]++;
      }
    });

    const data ={
      labels: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      datasets: [
        {
          label: "Created Todos",
          data: created,
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: "In-Progress Todos",
          data: inProgress,
          backgroundColor: "rgba(255, 205, 86, 0.5)",
        },
        {
          label: "Completed Todos",
          data: completed,
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    }

    return res.status(200).json(
      new apiResponse(200, "Todos Fetched!", data)
    )
})

export const getAllPieData = asyncHandler(async (req, res) => {

    const todos = await dashboardService.findAllTodos();

    let countInProgress = 0;
    let countCompleted = 0;

    todos.forEach(todo => {
      if (todo.status === "in-progress") countInProgress++;
      if (todo.status === "completed") countCompleted++;
    });

    const pieChartData = {
      labels: ["In-Progress Todos", "Completed Todos"],
      datasets: [
        {
          data: [countInProgress, countCompleted],
          backgroundColor: [
            "rgba(255, 205, 86, 0.5)",
            "rgba(53, 162, 235, 0.5)",
          ],
        },
      ],
    };

    return res.status(200).json(
      new apiResponse(200, "Todos Fetched!", pieChartData)
    )
})

// Admin dashboard Todos Details
export const getTotallTodos = asyncHandler(async (req, res) =>{
  const userId = req.user._id

  const totalCreated = await dashboardService.totalCreated();
  const totalInProgress = await dashboardService.getTotallInProgressTodos();
  const totalCompleted = await dashboardService.getTotallCompletedTodos();
  const totalCreatedUsers = await dashboardService.getTotallUsers();
// instaed of call then seperately use promise.all
  return res.status(200).json(
    new apiResponse(200, "Fetch total todos!", {
      totalCreated, 
      totalInProgress, 
      totalCompleted, 
      totalCreatedUsers
    })
  )
})

export const getChartData = asyncHandler(async (req, res) => {
  const userId = req.user?._id

  const created = Array(7).fill(0);
  const inProgress = Array(7).fill(0);
  const completed = Array(7).fill(0);

  const todos = await dashboardService.findUserTodos(userId);

  todos.forEach(todo => {
    if (!todo.createdAt) return;

    const createdAtDate = new Date(todo.createdAt);
    if (isNaN(createdAtDate)) return;

    const jsDay = createdAtDate.getDay(); // 0 = Sunday, 6 = Saturday
    const dayIndex = (jsDay + 6) % 7; // Adjust to make Monday = 0

    created[dayIndex]++;

    if (todo.status === "in-progress") {
      inProgress[dayIndex]++;
    } else if (todo.status === "completed") {
      completed[dayIndex]++;
    }
  });

  const data = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: [
      {
        label: "Created Todos",
        data: created,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "In-Progress Todos",
        data: inProgress,
        backgroundColor: "rgba(255, 205, 86, 0.5)",
      },
      {
        label: "Completed Todos",
        data: completed,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  }
  return res.status(200).json(
    new apiResponse(200, "Todos Fetched!", data)
  )
})

export const getPieData = asyncHandler(async (req, res) => {
const userId = req.user?._id

const todos = await dashboardService.findUserTodos(userId);

let countInProgress = 0;
let countCompleted = 0;

todos.forEach(todo => {
  if (todo.status === "in-progress") countInProgress++;
  if (todo.status === "completed") countCompleted++;
});

const pieChartData = {
  labels: ["In-Progress Todos", "Completed Todos"],
  datasets: [
    {
      data: [countInProgress, countCompleted],
      backgroundColor: [
        "rgba(255, 205, 86, 0.5)",
        "rgba(53, 162, 235, 0.5)",
      ],
    },
  ],
};

return res.status(200).json(
  new apiResponse(200, "Todos Fetched!", pieChartData)
)
})

// user dashboard Todos Details
export const getTodosDetailByUser = asyncHandler(async (req, res) =>{
    const userId = req.user._id

    const totalCreatedByUser = await dashboardService.getTotallTodosByUser(userId);
    const totalInProgressByUser = await dashboardService.getTotallInProgressTodosByUser(userId);
    const totalCompletedByUser = await dashboardService.getTotallCompletedTodosByUser(userId);
// instaed of call then seperately use promise.all

    return res.status(200).json(
      new apiResponse(200, "Fetch total User todos!", {
        totalCreatedByUser, 
        totalInProgressByUser, 
        totalCompletedByUser
      })
    )
})
