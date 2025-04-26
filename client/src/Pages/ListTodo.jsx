import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getFilteredRowModel, //
  getPaginationRowModel, //
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import DebouncedInput from "../Components/DebouncedInput";
import { useDispatch, useSelector } from "react-redux";
import { deleteTodo, fetchPaginatedTodos } from "../store/todo.slice";
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
const ListTodo = () => {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [fetchAgain, setFetchAgain] = useState(false);
  
  const state = useSelector(state => state.todo)
  const loadings = state?.loadings?.fetchPaginatedTodos
  const error = state?.errors?.fetchPaginatedTodos

  const user = useSelector((state) => state.auth.user);

  const { todoStore } = useSelector((state) => state.todo);

  const dispatch = useDispatch();

  const handleDelete = (id) => {
    showConfirmToast(async () => {
      const response = await dispatch(deleteTodo(id));
      if (response.payload.success) {
        setFetchAgain((prev) => !prev);
        toast.success(response.payload.message);
      }
    });
  };
  const navigate = useNavigate();

  const handleEdit = (todo) => {
    navigate(`/todo/edit/${todo._id}`);
  };

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("title", {
      header: "Title",
      cell: (info) => (
        <div
          style={{
            maxWidth: "200px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("description", {
      header: "Description",
      cell: (info) => (
        <div
          style={{
            maxWidth: "200px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <div
          style={{
            maxWidth: "200px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("due_date", {
      header: "Due Date",
      cell: (info) => (
        <div
          style={{
            maxWidth: "200px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("tag", {
      header: "Tag",
      cell: (info) => (
        <div
          style={{
            maxWidth: "200px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("assigned_to", {
      header: "Assigned",
      cell: (info) => (
        <div
          style={{
            maxWidth: "200px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("reminder", {
      header: "Reminder",
      cell: (info) => (
        <div
          style={{
            maxWidth: "200px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("repeat", {
      header: "Repeat",
      cell: (info) => (
        <div
          style={{
            maxWidth: "200px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("notes", {
      header: "Notes",
      cell: (info) => (
        <div
          style={{
            maxWidth: "200px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("achive", {
      header: "Achive",
      cell: (info) => (
        <div
          style={{
            maxWidth: "200px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("attachments", {
      header: "Attachments",
      cell: (info) => {
        const url = info.getValue();
        return url ? (
          <img
            src={url}
            alt="attachment"
            className="h-10 w-10 object-cover shadow-md"
          />
        ) : (
          <span className="text-slate-400 text-sm">No Attachment</span>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const todo = row.original;
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(todo)}
              className="bg-blue-800 text-white px-2 py-1 rounded text-sm cursor-pointer hover:bg-blue-900"
            >
              <EditIcon size={20} />
            </button>
            <button
              onClick={() => handleDelete(todo._id)}
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
      setPageIndex(newState.pageIndex);
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
      const userRole = user.data.role;

      const response = await dispatch(
        fetchPaginatedTodos({ pageSize, pageIndex, searchText, userRole })
      );
      if (response.payload.success) {
        setTotalPages(response.payload.data.totalPages);
        setHasMore(response.payload.data.hasMore);
        setData(response.payload.data.todos);
      }
    };

    dataLoad();
  }, [pageIndex, pageSize, searchText, fetchAgain]);

  // console.log("data", data);

  return (
    <div className="bg-white p-4 h-full w-full">
      <h2 className="text-lg font-bold mb-2 text-[#5d738c]">/ Todo List</h2>
      <div className="p-2 flex flex-col justify-start md:flex-row gap-2 items-center md:justify-between">
        <div className="flex gap-2 items-center w-full md:w-auto">
          <label htmlFor="search">
            <Search className="text-[#5d738c] cursor-pointer" size={20} />
          </label>
          <input
            id="search"
            type="text"
            className="p-2 outline-none border border-slate-200 rounded"
            onChange={(e) => {
              setSearchText(e.target.value)
              setPageIndex(1)
            }}
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
              <table className="min-w-[800px] border">
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
                  onClick={() => setPageIndex((old) => old - 1)}
                  disabled={pageIndex === 1}
                >
                  <ChevronLeft />
                </button>
                <span className="px-2 py-1">
                  {pageIndex} / {totalPages}
                </span>
                <button
                  className="px-1 py-1 bg-[#667a91] hover:bg-[#5d738c] rounded text-white cursor-pointer"
                  onClick={() => setPageIndex((old) => old + 1)}
                  disabled={!hasMore}
                >
                  <ChevronLeft className="rotate-180" />
                </button>
                <select
                  name=""
                  id=""
                  className="px-2 py-1 border border-slate-300"
                  onChange={(e) => {
                    setPageSize(e.target.value)
                    setPageIndex(1)
                  }}
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
      {error && (
        <div className="h-full w-full flex items-center justify-center">
          <h1 className="text-xl font-semibold text-red-500">
            Something went wrong 😥
          </h1>
        </div>
      )}
    </div>
  );
};

export default ListTodo;
