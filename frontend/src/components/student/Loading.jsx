import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

const Loading = () => {

  const {path} = useParams()
  const navigate = useNavigate()

  useEffect( () => {
    if(path){
      const timer = setTimeout( () => {
        navigate(`/${path}`)
      },5000)
      return () => clearTimeout(timer)
    }
  },[])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        {/* Spinning Loader */}
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>

        {/* Loading Text */}
        <p className="mt-4 text-lg font-semibold text-gray-700 md:text-xl">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
};

export default Loading