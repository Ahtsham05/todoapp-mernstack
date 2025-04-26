import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./Config"; // your Firebase setup


export const getChartData = async (userId) => {
  const labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const todosQuery = query(collection(db, "todos"), where("uid", "==", userId));
  const snapshot = await getDocs(todosQuery);

  const created = Array(7).fill(0);
  const inProgress = Array(7).fill(0);
  const completed = Array(7).fill(0);

  snapshot.forEach((doc) => {
    const todo = doc.data();

    if (!todo.created_at) return;
    const createdAtDate = new Date(todo.created_at);

    if (isNaN(createdAtDate)) return; // Skip invalid dates

    const jsDay = createdAtDate.getDay(); // 0 = Sunday, 6 = Saturday
    const dayIndex = (jsDay + 6) % 7;     // Adjust to make Monday = 0

    // Always count as "created"
    created[dayIndex]++;

    if (todo.status === "in-progress") {
      inProgress[dayIndex]++;
    } else if (todo.status === "completed") {
      completed[dayIndex]++;
    }
  });

  const chartData = {
    labels : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
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
  };

  return chartData;
};

export const getPieChartData = async (userId) => {
  const todosQuery = query(collection(db, "todos"), where("uid", "==", userId));
  const snapshot = await getDocs(todosQuery);

  let countInProgress = 0;
  let countCompleted = 0;

  snapshot.forEach((doc) => {
    const todo = doc.data();
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

  return pieChartData;
};

export const getTotalCreatedTodosByUid = async (userId) => {
  const todosRef = collection(db, "todos");
  const q = query(todosRef, where("uid", "==", userId));

  const snapshot = await getDocs(q);

  const totalCreated = snapshot.size; // number of todos for that user

  // console.log("Total Created Todos:", totalCreated);
  return totalCreated;
};

export const getTotalInProgressTodos = async (userId) => {
  const todosRef = collection(db, "todos");

  const q = query(
    todosRef,
    where("uid", "==", userId),
    where("status", "==", "in-progress")
  );

  const snapshot = await getDocs(q);

  const totalInProgress = snapshot.size;

  // console.log("Total In-Progress Todos:", totalInProgress);
  return totalInProgress;
};

export const getTotalCompletedTodos = async (userId) => {
  const todosRef = collection(db, "todos");

  const q = query(
    todosRef,
    where("uid", "==", userId),
    where("status", "==", "completed")
  );

  const snapshot = await getDocs(q);

  const totalCompleted = snapshot.size;

  // console.log("Total Completed Todos:", totalCompleted);
  return totalCompleted;
};

// Admin Calls from firestore

export const getAllChartData = async () => {
  const labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const todosQuery = collection(db, "todos");
  const snapshot = await getDocs(todosQuery);

  const created = Array(7).fill(0);
  const inProgress = Array(7).fill(0);
  const completed = Array(7).fill(0);

  snapshot.forEach((doc) => {
    const todo = doc.data();

    if (!todo.created_at) return;
    const createdAtDate = new Date(todo.created_at);

    if (isNaN(createdAtDate)) return; // Skip invalid dates

    const jsDay = createdAtDate.getDay(); // 0 = Sunday, 6 = Saturday
    const dayIndex = (jsDay + 6) % 7;     // Adjust to make Monday = 0

    // Always count as "created"
    created[dayIndex]++;

    if (todo.status === "in-progress") {
      inProgress[dayIndex]++;
    } else if (todo.status === "completed") {
      completed[dayIndex]++;
    }
  });

  const chartData = {
    labels : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
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
  };

  return chartData;
};

export const getAllPieChartData = async () => {
  const todosQuery = collection(db, "todos");
  const snapshot = await getDocs(todosQuery);

  let countInProgress = 0;
  let countCompleted = 0;

  snapshot.forEach((doc) => {
    const todo = doc.data();
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

  return pieChartData;
};

export const getAllTotalCreatedTodos = async () => {
  const todosRef = collection(db, "todos");

  const snapshot = await getDocs(todosRef);

  const totalCreated = snapshot.size; // number of todos for that user

  // console.log("Total Created Todos:", totalCreated);
  return totalCreated;
};

export const getAllTotalInProgressTodos = async () => {
  const todosRef = collection(db, "todos");

  const q = query(
    todosRef,
    where("status", "==", "in-progress")
  );

  const snapshot = await getDocs(q);

  const totalInProgress = snapshot.size;

  // console.log("Total In-Progress Todos:", totalInProgress);
  return totalInProgress;
};

export const getAllTotalCompletedTodos = async (userId) => {
  const todosRef = collection(db, "todos");

  const q = query(
    todosRef,
    where("status", "==", "completed")
  );

  const snapshot = await getDocs(q);

  const totalCompleted = snapshot.size;

  // console.log("Total Completed Todos:", totalCompleted);
  return totalCompleted;
};

export const getTotalUsers = async (userId) => {
  const todosRef = collection(db, "users");

  const snapshot = await getDocs(todosRef);

  const totalUsers = snapshot.size;

  // console.log("Total Completed Todos:", totalUsers);
  return totalUsers;
};