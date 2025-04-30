import React from 'react'
import { assets, dummyTestimonial } from '../../assets/assets'

const Testimonial = () => {
  return (
    <div className='pb-14 md:px-60 px-8'>
      <h2 className='text-3xl font-medium text-gray-800'>Testimonials</h2>
      <p className='md:text-base text-gray-500 mt-3'>Our learners share powerful stories of growth, new beginnings, and success — showcasing how the right platform, guidance, and courses helped them reach their full potential, both professionally and personally.</p>
      <div className='grid grid-cols-[auto] gap-8 mt-14 sm:grid-cols-1 md:grid-cols-[auto_auto] lg:grid-cols-[auto_auto_auto]'>
        {dummyTestimonial.map((testimonial, index) => (
          <div key={index} className='text-sm text-left bg-white border border-gray-500/30 pb-6 rounded-lg shadow-[0px_4px_15px_0px] overflow-hidden shadow-black/5'> 
            <div className='flex items-center gap-4 px-5 py-4 bg-blue-200'>
              <img className='h-12 w-12 rounded-full' src={testimonial.image} alt={testimonial.name} />
              <div>
                <h1 className='text-lg font-medium text-gray-800'>{testimonial.name}</h1>
                <p className='text-gray-800/80'>{testimonial.role}</p>
              </div>
              
            </div>
            <div className='p-5 pb-7'>
                <div className='flex gap-0.5'>
                  {[...Array(5)].map((_ , i) => (
                    <img className='h-5' key={i} src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank} alt="star" />
                  ))}
                </div>
                <p className='text-gray-500 mt-5'>{testimonial.feedback}</p>
              </div>
              <a href="#" className='text-blue-600 px-8 underline hover:font-bold'>Read more</a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Testimonial