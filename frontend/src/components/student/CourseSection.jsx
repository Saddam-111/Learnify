import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import CourseCard from './CourseCard'

const CourseSection = () => {
  const {allCourses} = useContext(AppContext)
  return (
    <div className='py-16 md:px-40 px-8'>
      <h2 className='text-3xl font-medium text-gray-700'>Elevate your learning experience with proven experts at the helm

</h2>
      <p className='text-sm md:text-base text-gray-500 mt-3 mb-4'>Unlock top-tier learning in fields like development, creativity, entrepreneurship, and wellness — every course is purpose-built to help you achieve your goals</p>

      <div className='grid grid-cols-1 md:grid-cols-4 px-4 md:px-0 md:my-16 my-10 gap-4'>
  {allCourses.slice(0, 4).map((course, index) => <CourseCard key={index} course={course} />)}
</div>




      <Link to={'/course-list'} onClick={() => scrollTo(0,0)} className='text-gray-500 border-4 border-l-pink-300 border-t-blue-400 border-r-pink-700 border-b-blue-700 px-15 py-3 rounded animate-pulse transition-all '>See More</Link>
    </div>
  )
}

export default CourseSection