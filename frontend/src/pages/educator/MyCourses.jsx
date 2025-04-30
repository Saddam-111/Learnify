import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import axios from 'axios';
import {toast} from 'react-toastify';

const MyCourses = () => {
  const { currency, backendUrl, getToken, isEducator } = useContext(AppContext);
  const [courses, setCourses] = useState(null);

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();
      const {data} = await axios.get(backendUrl + '/api/educator/courses', {headers: {Authorization: `Bearer ${token}` }})
      data.success && setCourses(data.courses)
    } catch (error) {
      toast.error(error.message)
    }
  };

  useEffect(() => {
    if(isEducator){

      fetchEducatorCourses();
    }
  }, [isEducator]);

  return courses ? (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      <h2 className="text-xl font-semibold mb-6">My Courses</h2>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-sm text-gray-600">
              <th className="px-4 py-3 font-semibold whitespace-nowrap">Course</th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">Earnings</th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">Students</th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">Published On</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((course) => (
              <tr key={course._id} className="border-t hover:bg-gray-50 text-sm">
                <td className="px-4 py-3 flex items-center gap-3 min-w-[200px]">
                  <img
                    src={course.courseThumbnail}
                    alt={course.courseTitle}
                    className="w-14 h-14 object-cover rounded-lg"
                  />
                  <span className="font-medium">{course.courseTitle}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {currency}{' '}
                  {Math.floor(
                    course.enrolledStudents.length *
                      (course.coursePrice - (course.discount * course.coursePrice) / 100)
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {course.enrolledStudents.length}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {new Date(course.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MyCourses;
