import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import Loading from '../../components/student/Loading';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/educator/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchDashboardData();
    }
  }, [isEducator]);

  return dashboardData ? (
    <div className="min-h-screen flex flex-col gap-8 p-4 pt-8 md:p-8">
      {/* Top Cards */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-4 shadow-md border border-pink-400 p-4 w-full sm:w-64 rounded-xl bg-white">
          <img src={assets.patients_icon} alt="Enrollments" className="w-10 h-10" />
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {dashboardData?.enrolledStudentsData?.length}
            </p>
            <p className="text-pink-600">Total Enrollments</p>
          </div>
        </div>

        <div className="flex items-center gap-4 shadow-md border border-pink-400 p-4 w-full sm:w-64 rounded-xl bg-white">
          <img src={assets.appointments_icon} alt="Courses" className="w-10 h-10" />
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {dashboardData.totalCourses}
            </p>
            <p className="text-pink-600">Total Courses</p>
          </div>
        </div>

        <div className="flex items-center gap-4 shadow-md border border-pink-400 p-4 w-full sm:w-64 rounded-xl bg-white">
          <img src={assets.earning_icon} alt="Earnings" className="w-10 h-10" />
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {currency}{dashboardData.totalEarnings}
            </p>
            <p className="text-pink-600">Total Earnings</p>
          </div>
        </div>
      </div>

      {/* Latest Enrollments Table */}
      <div className="w-full">
        <h2 className="text-xl font-semibold text-pink-700 mb-4">Latest Enrollments</h2>
        <div className="overflow-x-auto">
          <table className="min-w-[800px] bg-white border border-pink-300 rounded-lg shadow-md">
            <thead className="bg-pink-100 text-blue-700 text-left">
              <tr>
                <th className="px-4 py-3 border-b border-pink-200">Sr No</th>
                <th className="px-4 py-3 border-b border-pink-200">Student</th>
                <th className="px-4 py-3 border-b border-pink-200">Course Title</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData?.enrolledStudentsData?.map((item, index) => (
                <tr key={index} className="hover:bg-pink-50 transition-colors">
                  <td className="px-4 py-3 border-b border-pink-100">{index + 1}</td>
                  <td className="px-4 py-3 border-b border-pink-100 flex items-center gap-3">
                    <img
                      src={item.student.imageUrl}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-blue-300"
                    />
                    <span className="text-gray-700">{item.student.name}</span>
                  </td>
                  <td className="px-4 py-3 border-b border-pink-100 text-gray-800">
                    {item.courseTitle}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Dashboard;
