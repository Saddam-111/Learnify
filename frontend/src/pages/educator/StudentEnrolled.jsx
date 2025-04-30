import React, { useContext, useEffect, useState } from 'react';
import { dummyStudentEnrolled } from '../../assets/assets';
import Loading from '../../components/student/Loading';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import {toast} from 'react-toastify';

const StudentEnrolled = () => {
  const [enrolledStudents, setEnrolledCourses] = useState(null);

  const {backendUrl, getToken, isEducator} = useContext(AppContext)

  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken();
    const {data} = await axios.get(backendUrl + '/api/educator/enrolled-students', {headers: {Authorization: `Bearer ${token}` }})
      if(data.success){
        setEnrolledCourses(data.enrolledStudents.reverse())
      } else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  useEffect(() => {
    if(isEducator){

      fetchEnrolledStudents();
    }
  }, [isEducator]);

  return enrolledStudents ? (
    <div className="min-h-screen flex flex-col md:p-8 p-4 pt-8">
      <div className="max-w-6xl w-full mx-auto overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-sm text-gray-600">
              <th className="px-4 py-3 text-left font-semibold">#</th>
              <th className="px-4 py-3 text-left font-semibold">Student</th>
              <th className="px-4 py-3 text-left font-semibold">Course Title</th>
              <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {enrolledStudents.map((item, index) => (
              <tr key={index} className="border-t hover:bg-gray-50 text-sm">
                <td className="px-4 py-3 whitespace-nowrap">{index + 1}</td>
                <td className="px-4 py-3 flex items-center gap-3 min-w-[180px]">
                  <img
                    src={item.student.imageUrl}
                    alt={item.student.name}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                  <span>{item.student.name}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{item.courseTitle}</td>
                <td className="px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                  {new Date(item.purchaseDate).toLocaleDateString()}
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

export default StudentEnrolled;
