import { Loader2 } from 'lucide-react'
import React from 'react'

const DashboardC = ({icon,title,data,loading}) => {

  const isLoading = loading !== false;

  return (
    <div className="grid gap-2 p-2 border rounded border-slate-200">
        <h1 className='text-sm text-shadow-neutral-800  flex gap-2 items-center'><span className='p-2 rounded-full bg-blue-300'>{icon}</span><span>{title}</span></h1>
        <p className='text-2xl font-bold text-center text-shadow-neutral-800 flex items-center justify-center'>{isLoading ? (<Loader2 className='size-8 animate-spin text-blue-300'/>) :data}</p>
    </div>
  )
}

export default DashboardC