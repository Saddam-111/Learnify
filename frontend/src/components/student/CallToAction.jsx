import React from 'react'
import { assets } from '../../assets/assets'

const CallToAction = () => {
  return (
    <div className='flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0'>
      <h1 className='text-xl md:text-4xl text-gray-800 font-semibold'>Learn what you love, when you want</h1>
      <p className='text-gray-500 sm:text-sm'>Explore the freedom to learn at your own pace, whenever and wherever suits you. Choose from a vast range of topics and gain the skills that ignite your passion and potential.

</p>
      <div className='flex items-center font-medium gap-6 mt-4'>
        <button className='px-10 py-3 rounded-md text-white bg-blue-600'>Take the first step</button>
        <button className='flex items-center gap-2'>Unlock more insights <img className='mt-2' src={assets.arrow_icon} alt="arrow-icons" /></button>
      </div>
    </div>
  )
}

export default CallToAction