import { Loader2 } from 'lucide-react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { getCurrenUser } from '../store/auth.slice'

const Private = ({children}) => {

  const dispatch = useDispatch()
  useEffect(()=>{
    dispatch(getCurrenUser())
  },[])

  const  state = useSelector(state => state.auth)
  // console.log("state auth",state)

  const user = state?.user
  const loadings = state?.loadings?.getCurrenUser
  const errors = state?.errors?.getCurrenUser
  // console.log("state",user)
  if(loadings){
    return (
      <div className='h-screen w-screen flex items-center justify-center'>
        <Loader2 className='animate-spin h-8 w-8' />
      </div>
    )
  }else{
    if(user?.data?.role){
      return children
    }
    if(errors)
    return  <Navigate to={'/login'}/>
  }

   
}

export default Private