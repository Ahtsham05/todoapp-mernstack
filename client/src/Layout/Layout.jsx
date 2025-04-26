import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import SideBar from '../Components/SideBar'
import { Link } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { CirclePower, Menu, Power, X } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { logout } from '../store/auth.slice'

const Layout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogout = async() => {
    const action = await dispatch(logout())
    // console.log(action)
    if(action.payload.success){
      localStorage.clear()
      toast.success(action.payload.message)
      navigate("/login")
    }
  }
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className='px-2 md:px-5 lg:px-10 bg-slate-100 flex max-h-screen min-h-screen overflow-hidden relative'>
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className='bg-slate-100 border border-slate-200 flex-1 flex flex-col'>
        <div className='h-[60px] flex items-center justify-between px-4 bg-white border border-slate-100'>
          <Link to={"/"} className='text-base font-semibold text-[#667a91] hidden lg:flex'>Dashboard</Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className='flex lg:hidden'>
            <Menu className='text-[#667a91] font-semibold cursor-pointer' size={24} />
          </button>
          <button className='p-2 rounded text-slate-50 bg-red-400 hover:bg-red-500 cursor-pointer' onClick={handleLogout}><Power size={20} /></button>
        </div>
        <div className='max-h-[calc(100vh-60px)] min-h-[calc(100vh-60px)] overflow-hidden overflow-y-auto w-full p-2 relative'>
          <Outlet/>
        </div>
      </div>
      <Toaster />
    </div>
  )
}

export default Layout