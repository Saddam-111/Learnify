import React from 'react'
import { assets } from '../../assets/assets'
import { UserButton, useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const { user } = useUser()

  return (
    <div className='flex items-center justify-between px-4 md:px-10 lg:px-20 py-4 shadow-md bg-gradient-to-r from-pink-100 via-white to-blue-100'>
      <Link to='/'>
        <img src={assets.logo} alt="logo" className='w-28 lg:w-32 cursor-pointer transition-transform hover:scale-105 rounded-xl border border-blue-200' />
      </Link>
      <div className='flex items-center gap-4 md:gap-6 text-gray-800 text-sm md:text-base font-medium'>
        <p className='text-blue-600'>Hi, {user ? user.fullName : "Developer"}</p>
        {
          user ? (
            <UserButton afterSignOutUrl='/' />
          ) : (
            <img 
              src={assets.profile_img} 
              alt="Profile" 
              className='w-8 h-8 rounded-full border border-pink-400' 
            />
          )
        }
      </div>
    </div>
  )
}

export default Navbar
