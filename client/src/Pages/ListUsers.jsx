import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getFilteredRowModel, //
  getPaginationRowModel, //
} from "@tanstack/react-table";
import DebouncedInput from "../Components/DebouncedInput";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronLeft,
  Delete,
  EditIcon,
  Filter,
  Loader2,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import { showConfirmToast } from "../Components/ConfirmBox";
import { deleteUser, fetchAllPaginatedUsers } from "../store/user.slice";
import EditRole from "../Components/EditRole";

const ListUsers = () => {
  const [globalFilter, setGlobalFilter] = React.useState("");

  const [pageIndex, setpageIndex] = useState(1);

  const [pageSize, setPageSize] = useState(5);
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState("");

  const [editRoleStatus, setEditRoleStatus] = useState(false);
  const [editData, setEditData] = useState(null);
  const [fetchAgain, setFetchAgain] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const IsAdmin = user?.data?.role === "admin" ? true : false;


  const state = useSelector((state) => state.user);
  const loadings = state.loadings?.fetchAllPaginatedUsers;
  const errors = state.errors?.fetchAllPaginatedUsers
  // console.log("=>>>>>>",state)

  const { todoStore } = useSelector((state) => state.todo);

  const dispatch = useDispatch();

  const handleDelete = (id) => {
    showConfirmToast(async () => {
      const response = await dispatch(deleteUser(id));
      if (response.payload.success) {
        setFetchAgain((prev) => !prev);
        toast.success(response.payload.message);
      }
    });
  };

  const handleEdit = (user) => {
    setEditData(user);
    setEditRoleStatus(true);
  };

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("role", {
      header: "Role",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("createdAt", {
      header: "Created At",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("verified", {
      header: "Verified",
      cell: (info) => (info.getValue() ? "Yes" : "No"),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(user)}
              className="bg-blue-800 text-white px-2 py-1 rounded text-sm cursor-pointer hover:bg-blue-900"
            >
              <EditIcon size={20} />
            </button>
            <button
              onClick={() => handleDelete(user?._id)}
              className="bg-red-500 text-white px-2 py-1 rounded text-sm cursor-pointer hover:bg-red-600"
            >
              <Delete size={20} />
            </button>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    pageCount: -1,
    state: {
      //
      globalFilter,
      pagination: {
        pageIndex,
        pageSize,
      },
    }, //
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setpage(newState.pageIndex);
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter, //
    getFilteredRowModel: getFilteredRowModel(), //
    getPaginationRowModel: getPaginationRowModel(), //
    globalFilterFn: (row, columnId, filterValue) => {
      return row
        .getVisibleCells()
        .some((cell) =>
          String(cell.getValue())
            .toLowerCase()
            .includes(filterValue.toLowerCase())
        );
    },
  });

  useEffect(() => {
    const dataLoad = async () => {
      const response = await dispatch(
        fetchAllPaginatedUsers({ pageSize, pageIndex, searchText })
      );

      if (fetchAllPaginatedUsers.fulfilled.match(response)) {
        // console.log("response", response.payload.users);
        setTotalPages(response.payload.totalPages);
        setHasMore(response.payload.hasMore);
        setData(response.payload.users);
      }
    };
    dataLoad();
  }, [pageIndex, pageSize, searchText, fetchAgain]);

  // console.log("data", data);

  return (
    <>
      {editRoleStatus && (
        <EditRole
          setFetchAgain={setFetchAgain}
          editData={editData}
          setEditRoleStatus={setEditRoleStatus}
        />
      )}
      <div className="bg-white p-4 h-full w-full">
        <h2 className="text-lg font-bold mb-2 text-[#5d738c]">/ User List</h2>
        <div className="p-2 flex flex-col justify-start md:flex-row gap-2 items-center md:justify-between">
          <div className="flex gap-2 items-center w-full md:w-auto">
            <label htmlFor="search">
              <Search className="text-[#5d738c] cursor-pointer" size={20} />
            </label>
            <input
              id="search"
              type="text"
              className="p-2 outline-none border border-slate-200 rounded"
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search Here..."
            />
          </div>
          <div className="flex items-center w-full gap-2 md:w-auto">
            <label htmlFor="filter">
              <Filter className="text-[#5d738c] cursor-pointer" size={20} />
            </label>
            <DebouncedInput
              id="filter"
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
              className="p-2 outline-none border border-slate-200 rounded"
              placeholder="Filter Data From Columns..."
            />
          </div>
        </div>
        {loadings && (
          <div className="h-[50vh] w-full flex items-center justify-center">
            <Loader2 className="animate-spin h-8 w-8 text-[#5d738c]" />
          </div>
        )}
        {!loadings && (
          <>
            {data[0] ? (
              <div className="overflow-x-auto min-h-[70vh] max-w-[85vw] lg:max-w-[calc(100vw-350px)] mx-auto">
                <table className="md:min-w-[700px] lg:min-w-[1000px] border">
                  <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr
                        key={headerGroup.id}
                        className="bg-[#5d738c] text-white text-sm"
                      >
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="p-1 border border-slate-100 py-2"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="even:bg-gray-50">
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="p-2 border border-slate-100 text-sm whitespace-nowrap"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex gap-2 py-4">
                  <button
                    className="px-1 py-1 bg-[#667a91] hover:bg-[#5d738c] rounded text-white cursor-pointer"
                    onClick={() => setpageIndex((old) => Math.max(old - 1, 0))}
                    disabled={pageIndex === 1}
                  >
                    <ChevronLeft />
                  </button>
                  <span className="px-2 py-1">
                    {pageIndex} / {totalPages}
                  </span>
                  <button
                    className="px-1 py-1 bg-[#667a91] hover:bg-[#5d738c] rounded text-white cursor-pointer"
                    onClick={() => setpageIndex((old) => old + 1)}
                    disabled={!hasMore}
                  >
                    <ChevronLeft className="rotate-180" />
                  </button>
                  <select
                    name=""
                    id=""
                    className="px-2 py-1 border border-slate-300"
                    onChange={(e) => setPageSize(e.target.value)}
                    value={pageSize}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <h1 className="text-xl font-semibold text-[#5d738c]">
                  Data Not Found 😥
                </h1>
              </div>
            )}
          </>
        )}
        {errors && (
          <div className="h-full w-full flex items-center justify-center">
            <h1 className="text-xl font-semibold text-red-500">
              Something went wrong 😥
            </h1>
          </div>
        )}
      </div>
    </>
  );
};

export default ListUsers;
