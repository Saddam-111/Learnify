import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from './SearchBar'

const Hero = () => {
  return (
    <div className='w-full px-7 md:px-0 pt-20 md:pt-36 space-y-7 text-center flex flex-col items-center justify-center'>

      {/* Hero Top: Image + Heading side-by-side on md+, stacked on mobile */}
      <div className='flex flex-col lg:flex-row items-center justify-center gap-8 max-w-7xl w-full px-4 lg:px-10'>

        {/* Hero Image */}
        <div className='w-full lg:w-1/2'>
          <img 
            src={assets.Hero} 
            alt="Hero" 
            className='w-full h-auto object-contain mx-auto'
          />
        </div>

        {/* Hero Heading */}
        <div className='w-full lg:w-1/2'>
          <h1 className='text-3xl md:text-5xl font-bold text-gray-800 leading-snug'>
          Unlock your potential with courses tailored to your goals
            <span className='text-pink-500'> — all in one powerful platform.</span>
          </h1>
        </div>

      </div>

      {/* Description for medium & larger screens */}
      <p className='hidden md:block text-gray-600 max-w-2xl mx-auto px-4'>
      Learn from top educators, engage with hands-on content, and grow within a thriving learning community built for your success.
      </p>

      {/* Description for small screens */}
      <p className='md:hidden text-gray-600 max-w-2xl mx-auto px-4'>
        Experience the perfect blend of globally recognized educators and interactive, real-world content designed to help you learn faster, retain more, and apply your skills confidently.
      </p>

      {/* SearchBar */}
      <SearchBar />
    </div>
  )
}

export default Hero
