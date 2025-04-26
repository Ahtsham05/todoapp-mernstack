import React from "react";
import DashboardC from "../Components/DashboardC";
import {
  CheckCheck,
  CircleEllipsis,
  Loader2,
  ReplyAll,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import {
  getallpiechart,
  getalluserbarchart,
  getpiechart,
  getsingleuserbarchart,
  getTotallTodos,
  getTotallTodosByUser,
} from "../store/dashboard.slice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Todos Activity",
    },
  },
  scales: {
    y: {
      beginAtZero: true, // Start from 0
      min: 0, // Optional: Set minimum value
      max: 20, // Optional: Set maximum value
      ticks: {
        stepSize: 2, // Optional: Step between ticks
        callback: (value) => `${value}`, // Format tick labels
      },
    },
  },
};

const Dashboard = () => {
  const [allPieData, setAllPieData] = useState(null);
  const [allChartData, setAllChartData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [pieData, setPieData] = useState(null);

  const [totalTodos, setTotalTodos] = useState(0);
  const [totalInProgress, setTotalInProgress] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);

  const [AllTotalTodos, setAllTotalTodos] = useState(0);
  const [AllTotalInProgress, setAllTotalInProgress] = useState(0);
  const [AllTotalCompleted, setAllTotalCompleted] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);


  const user = useSelector((state) => state.auth?.user);
  const IsAdmin = user?.data?.role === "admin" ? true : false;

  const state = useSelector(state => state.dashboard)

  const totalTodosLoading = state.loadings?.getTotallTodosByUser
  const AllTotalTodosLoading = state.loadings?.getTotallTodos

  // console.log("state=>>>>>>>>>>>>",state)
  // console.log("AllTotalTodosLoading=>>>>>>>>>>>>",AllTotalTodosLoading)
  // console.log("totalTodosLoading=>>>>>>>>>>>>",totalTodosLoading)
  const dispatch = useDispatch();

  useEffect(() => {
    const loadData = async () => {
      const getTotallTodosByUserResponse = await dispatch(
        getTotallTodosByUser()
      );
      if (getTotallTodosByUserResponse.payload.success) {
        setTotalTodos(
          getTotallTodosByUserResponse.payload.data.totalCreatedByUser
        );
        setTotalInProgress(
          getTotallTodosByUserResponse.payload.data.totalInProgressByUser
        );
        setTotalCompleted(
          getTotallTodosByUserResponse.payload.data.totalCompletedByUser
        );
      }

      const getsinglechart = await dispatch(getsingleuserbarchart());
      if (getsinglechart.payload.success) {
        setChartData(getsinglechart.payload.data);
      }

      const getpiechartresponse = await dispatch(getpiechart());
      if (getpiechartresponse.payload.success) {
        setPieData(getpiechartresponse.payload.data);
      }

      if (IsAdmin) {
        const getTotalTodoResponse = await dispatch(getTotallTodos());
        if (getTotalTodoResponse.payload.success) {
          setAllTotalTodos(getTotalTodoResponse.payload.data.totalCreated);
          setAllTotalInProgress(
            getTotalTodoResponse.payload.data.totalInProgress
          );
          setAllTotalCompleted(
            getTotalTodoResponse.payload.data.totalCompleted
          );
          setTotalUsers(getTotalTodoResponse.payload.data.totalCreatedUsers);
        }

        const getallchart = await dispatch(getalluserbarchart());
        if (getallchart.payload.success) {
          setAllChartData(getallchart.payload.data);
        }

        const getallpiechartresponse = await dispatch(getallpiechart());
        if (getallpiechartresponse.payload.success) {
          setAllPieData(getallpiechartresponse.payload.data);
        }
      }
    };
    loadData();
  }, []);

  return (
    <div className="max-h-[calc(100vh-80px)] min-h-[calc(100vh-80px)] w-full bg-slate-100 p-[2px]">
      <div className="h-full w-full bg-white rounded p-2 min-h-[85vh]">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${
            IsAdmin ? "lg:grid-cols-4" : "lg:grid-cols-3"
          } gap-2`}
        >
          {IsAdmin && (
            <>
              <DashboardC
                title={"Total Users"}
                data={totalUsers}
                loading={AllTotalTodosLoading}
                icon={<User className="text-slate-50" size={18} />}
              />
              <DashboardC
                title={"Total Created Todos"}
                data={AllTotalTodos}
                loading={AllTotalTodosLoading}
                icon={<ReplyAll className="text-slate-50" size={18} />}
              />
              <DashboardC
                title={"Total In-Progress Todos"}
                data={AllTotalInProgress}
                loading={AllTotalTodosLoading}
                icon={<CircleEllipsis className="text-slate-50" size={18} />}
              />
              <DashboardC
                title={"Total Completed Todos"}
                data={AllTotalCompleted}
                loading={AllTotalTodosLoading}
                icon={<CheckCheck className="text-slate-50" size={18} />}
              />
            </>
          )}
          <DashboardC
            title={"Your Created Todos"}
            data={totalTodos}
            loading={totalTodosLoading}
            icon={<ReplyAll className="text-slate-50" size={18} />}
          />
          <DashboardC
            title={"Your In-Progress Todos"}
            data={totalInProgress}
            loading={totalTodosLoading}
            icon={<CircleEllipsis className="text-slate-50" size={18} />}
          />
          <DashboardC
            title={"Your Completed Todos"}
            data={totalCompleted}
            loading={totalTodosLoading}
            icon={<CheckCheck className="text-slate-50" size={18} />}
          />
        </div>
        {IsAdmin && (
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-2">
            <div className="border border-slate-200 rounded p-2">
              <h1 className="text-base font-semibold">All Activity Details</h1>
              <div className="h-[250px]">
                {allChartData ? (
                  <>
                    {AllTotalTodos === 0 ? (
                      <div className="flex items-center justify-center h-[250px]">
                        <h1 className="text-slate-500 text-base font-semibold">
                          No Enough Data To Show Charts
                        </h1>
                      </div>
                    ) : (
                      <Bar data={allChartData} options={options} />
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="size-8 animate-spin text-blue-300" />
                  </div>
                )}
              </div>
            </div>
            <div className="border border-slate-200 rounded p-2">
              <h1 className="text-base font-semibold">All Activity Details</h1>

              <div className="h-[250px]">
                {allPieData ? (
                  <>
                    {AllTotalTodos === 0 ? (
                      <div className="flex items-center justify-center h-[250px]">
                        <h1 className="text-slate-500 text-base font-semibold">
                          No Enough Data To Show Charts
                        </h1>
                      </div>
                    ) : (
                      <Pie
                        data={allPieData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "bottom",
                            },
                          },
                        }}
                      />
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="size-8 animate-spin text-blue-300" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div className="border border-slate-200 rounded p-2">
            <h1 className="text-base font-semibold">Your Activity Details</h1>

            <div className="h-[250px]">
              {chartData ? (
                <>
                  {totalTodos === 0 ? (
                    <div className="flex items-center justify-center h-[250px]">
                      <h1 className="text-slate-500 text-base font-semibold">
                        No Enough Data To Show Charts
                      </h1>
                    </div>
                  ) : (
                    <Bar data={chartData} options={options} />
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-[250px]">
                  <Loader2 className="size-8 animate-spin text-blue-300" />
                </div>
              )}
            </div>
          </div>
          <div className="border border-slate-200 rounded p-2">
            <h1 className="text-base font-semibold">Your Activity Details</h1>
            <div className="h-[250px]">
              {pieData ? (
                <>
                  {totalTodos === 0 ? (
                    <div className="flex items-center justify-center h-[250px]">
                      <h1 className="text-slate-500 text-base font-semibold">
                        No Enough Data To Show Charts
                      </h1>
                    </div>
                  ) : (
                    <Pie
                      data={pieData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom",
                          },
                        },
                      }}
                    />
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="size-8 animate-spin text-blue-300" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
