import { X } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { updateRole } from "../store/user.slice";

const EditRole = ({editData,setEditRoleStatus,setFetchAgain}) => {

    const [role,setRole] = useState(editData?.role)
    const dispatch = useDispatch()

    const roleHandler = async ()=>{
        const update = { ...editData, role:role}
        const response = await dispatch(updateRole(update))
        if(response.payload.success){
            setEditRoleStatus(false)
            setFetchAgain((prev)=> !prev)
            toast.success(response.payload.message)
        }
    }

  return (
    <div className="absolute z-20 h-full w-full bg-black/45 flex items-center justify-center">
      <div className="p-2 bg-white rounded min-w-[300px] grid gap-4">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">Edit Role</h1>
          <span>
            <X className="cursor-pointer text-[#5d738c]" onClick={()=>setEditRoleStatus(false)}/>
          </span>
        </div>
        <div>
          <label htmlFor="role" className="font-semibold text-sm">
            Change Role
          </label>
          <select value={role} onChange={(e)=>setRole(e.target.value)} className="w-full p-2 rounded border border-slate-200 outline-none">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button className="p-2 bg-[#5d738c] text-slate-50 rounded hover:cursor-pointer" onClick={roleHandler}>Change</button>
      </div>
    </div>
  );
};

export default EditRole;
