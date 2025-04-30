import React, { useContext } from 'react'
import { assets } from '../../assets/assets.js'
import { Link } from 'react-router-dom'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { AppContext } from '../../context/AppContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {
  const { navigate, isEducator, backendUrl, setIsEducator, getToken } = useContext(AppContext)
  const { openSignIn } = useClerk()
  const { user } = useUser()

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate('/educator')
        return
      }
      const token = await getToken();
      const { data } = await axios.get(backendUrl + '/api/educator/update-role', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        setIsEducator(true)
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const isCourseListPage = location.pathname.includes('/course-list')

  return (
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b py-4 shadow-md
      ${isCourseListPage ? "bg-gradient-to-bl from-pink-300 via-white to-blue-200" : "bg-gradient-to-r from-pink-400 via-white to-blue-200"}`}>

      <img 
        onClick={() => navigate('/')} 
        src={assets.logo} 
        alt="logo" 
        className='w-28 lg:w-32 cursor-pointer transition-transform hover:scale-105 rounded-xl border border-blue-200' 
      />

      <div className='hidden md:flex items-center gap-6 text-gray-800 font-medium'>
        {user && (
          <>
            <button 
              onClick={becomeEducator} 
              className='hover:text-pink-600 hover:bg-transparent transition-colors border-2 px-4 py-1 rounded-2xl bg-blue-400 text-white'
            >
              {isEducator ? "Educator Dashboard" : "Become Educator"}
            </button>
            <Link 
              to='/my-enrollment' 
              className='hover:text-blue-600 transition-colors'
            >
              My Enrollments
            </Link>
          </>
        )}
        {
          user ? (
            <UserButton />
          ) : (
            <button 
              onClick={() => openSignIn()} 
              className='bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white px-5 py-2 rounded-full transition'
            >
              Create Account
            </button>
          )
        }
      </div>

      {/* Mobile View */}
      <div className='md:hidden flex items-center gap-4 text-gray-800 text-sm'>
        {user && (
          <>
            <button 
              onClick={becomeEducator} 
              className='hover:text-pink-600 transition-colors'
            >
              {isEducator ? "Dashboard" : "Educator"}
            </button>
            <Link 
              to='/my-enrollment' 
              className='hover:text-blue-600 transition-colors'
            >
              Enrollments
            </Link>
          </>
        )}
        {
          user ? (
            <UserButton />
          ) : (
            <button onClick={() => openSignIn()}>
              <img src={assets.user_icon} alt="Sign In" className='w-6' />
            </button>
          )
        }
      </div>
    </div>
  )
}

export default Navbar
