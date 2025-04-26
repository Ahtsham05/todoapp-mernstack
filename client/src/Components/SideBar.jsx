import {
  CirclePlus,
  GalleryVerticalEnd,
  LayoutDashboard,
  Menu,
  User,
  X,
} from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

function extractNameFromEmail(email) {
  const rawName = email.split("@")[0];
  const parts = rawName.split(/[._-]/); // split by ., _, -
  return parts
    .map(
      (part) =>
        part
          .replace(/[0-9]/g, "") // remove numbers
          .replace(/[^a-zA-Z]/g, "") // remove any other non-letter chars
    )
    .filter((part) => part.length > 0) // remove empty parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}
const SideBar = ({ sidebarOpen, setSidebarOpen }) => {
  const user = useSelector((state) => state.auth.user);
  const userName = user?.data?.email
    ? extractNameFromEmail(user?.data?.email)
    : "User Name";
  const IsAdmin = user?.data?.role === "admin" ? true : false;
  const location = useLocation();

  return (
    <>
      <div
        className={`fixed z-20 inset-y-0 left-0 text-white w-64 transform bg-white  max-h-screen min-h-screen overflow-hidden overflow-y-auto min-w-[220px] max-w-[220px]  ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0`}
      >
        <div className="flex flex-col gap-3">
          <h1 className="text-xl font-bold capitalize p-2 text-[#667a91] flex items-center justify-between px-4">
            {sidebarOpen ? (
              <X
                className="text-blue-800"
                onClick={() => setSidebarOpen(false)}
              />
            ) : (
              <Menu className="text-blue-800" />
            )}
            <span>{IsAdmin ? "Admin" : "User"}</span>
          </h1>
          <div className="flex items-center gap-4 my-5 px-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="user"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="text-sm text-slate-800">Wellcome</div>
              <div className="text-base capitalize text-slate-900 font-semibold text-wrap">
                {userName}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <Link
              onClick={() => setSidebarOpen(false)}
              to={"/"}
              className={`flex items-center gap-4 py-2 hover:text-blue-800 hover:bg-slate-50 cursor-pointer transition-all px-4 text-sm ${
                location.pathname === "/" ? "text-blue-800" : "text-slate-900"
              }`}
            >
              <LayoutDashboard size={20} />
              <div className="capitalize font-semibold">Dashboard</div>
            </Link>
            <Link
              onClick={() => setSidebarOpen(false)}
              to={"/add"}
              className={`flex items-center gap-4 py-2 hover:text-blue-800 hover:bg-slate-50 cursor-pointer transition-all px-4 text-sm ${
                location.pathname === "/add"
                  ? "text-blue-800"
                  : "text-slate-900"
              }`}
            >
              <CirclePlus size={20} />
              <div className="capitalize font-semibold">Add Todos</div>
            </Link>
            <Link
              onClick={() => setSidebarOpen(false)}
              to={"/list"}
              className={`flex items-center gap-4 py-2 hover:text-blue-800 hover:bg-slate-50 cursor-pointer transition-all px-4 text-sm ${
                location.pathname === "/list"
                  ? "text-blue-800"
                  : "text-slate-900"
              }`}
            >
              <GalleryVerticalEnd size={20} />
              <div className="capitalize font-semibold">All Todos</div>
            </Link>
            {IsAdmin && (
              <Link
                onClick={() => setSidebarOpen(false)}
                to={"/users"}
                className={`flex items-center gap-4 py-2 hover:text-blue-800 hover:bg-slate-50 cursor-pointer transition-all px-4 text-sm ${
                  location.pathname === "/users"
                    ? "text-blue-800"
                    : "text-slate-900"
                }`}
              >
                <User size={20} />
                <div className="capitalize font-semibold">All Users</div>
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* Overlay on small screens */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default SideBar;
