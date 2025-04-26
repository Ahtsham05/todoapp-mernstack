import { useEffect, useState } from "react";
import Layout from "./Layout/Layout";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import AddTodo from "./Pages/AddTodo";
import ListTodo from "./Pages/ListTodo";
import NotFound from "./Pages/NotFound";
import Dashboard from "./Pages/Dashboard";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Private from "./Components/Private";
import Public from './Components/Public'
import ListUsers from "./Pages/ListUsers";
import ForgotPassword from './Pages/ForgotPassword'
import ResetPassword from "./Pages/ResetPassword";

function App() {
  
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Private>
              <Layout />
            </Private>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="add" element={<AddTodo />} />
          <Route path="list" element={<ListTodo />} />
          <Route path="users" element={<ListUsers />} />
          <Route path="/todo/edit/:id" element={<AddTodo />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/signup" element={
          <Public>
            <Signup />
          </Public>
        } />
        <Route path="/login" element={
          <Public>
            <Login />
          </Public>
        } />
        <Route path="/forgotpassword" element={
          <Public>
            <ForgotPassword />
          </Public>
        } />
        <Route path="/reset-password/:token" element={
          <Public>
            <ResetPassword />
          </Public>
        } />
      </Routes>
    </>
  );
}

export default App;
