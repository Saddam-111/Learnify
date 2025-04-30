import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='bg-gray-900 md:px-36 text-left w-full mt-10'>
      <div className='flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30'>
        <div className='flex flex-col md:items-start items-center w-full'>
          <Link to={'/'}>
          <img src={assets.logo_dark} width={190} alt="logo" className='rounded-2xl' />
          </Link>
          <p className='mt-6 text-white/80 text-center md:text-left text-sm'> We are committed to providing high-quality education, empowering learners to unlock their full potential and achieve their goals with top-notch courses and expert instructors.</p>
        </div>
        <div className='flex flex-col md:items-start items-center w-full'>
          <h2 className='font-semibold text-white mb-5'>Company</h2>
          <ul className='flex md:flex-col w-full justify-center text-sm text-white md:space-y-2'>
            <li><a href="">Home</a></li>
            <li><a href="">About</a></li>
            <li><a href="">Contact us</a></li>
            <li><a href="">Privacy policy</a></li>
          </ul>
        </div>
        <div className='hidden md:flex flex-col items-start w-full'>
          <h2 className='font-semibold text-white mb-5'>Suscribe to our newsLetter</h2>
           <p className='text-sm text-white'>Stay updated with the latest news, articles, and resources delivered straight to your inbox every week.</p>
           <div className='flex gap-3 mt-3'>
            <input type="email" placeholder='Enter your email' className='border border-gray-500 bg-gray-800 text-gray-500 placeholder-gray-500 outline-none w-64 h-9 rounded px-2 text-sm' />
            <button className='bg-blue-600 text-white rounded w-24 h-9'>Subscribe</button>
           </div>
        </div>
      </div>
      <p className='py-4 text-center text-xs text-white'>Copyright 2025 &copy; Learnify. All Right Reserved.</p>
    </footer>
  )
}

export default Footer