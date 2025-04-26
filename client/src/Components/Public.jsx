import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { getCurrenUser } from '../store/auth.slice'
import { Loader2 } from 'lucide-react'

const Public = ({children}) => {
  const dispatch = useDispatch()
  useEffect(()=>{
    dispatch(getCurrenUser())
  },[])

  const  state = useSelector(state => state.auth)
  // console.log("state auth",state)
  const user = state.user
  const loadings = user?.loadings?.getCurrenUser


  if(loadings){
    return (
      <div className='h-screen w-screen flex items-center justify-center'>
        <Loader2 className='animate-spin h-8 w-8' />
      </div>
    )
  }else{
    if(!user?.data?.role){
      return children
    }
    if(user?.data?.role)
    return  <Navigate to={'/'}/>
  }
}

export default Public