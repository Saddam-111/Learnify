import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Footer from "../../components/student/Footer";
import { Line } from "rc-progress";
import axios from "axios";
import {toast} from "react-toastify";

const MyEnrollment = () => {
  const {
    enrolledCourses,
    calculateCourseDuration,
    navigate,
    userData,
    fetchUserEnrolledCourses,
    getToken,
    calculateNoOfLectures,
    backendUrl,
  } = useContext(AppContext);

  const [progressArray, setProgressArray] = useState([]);

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          const { data } = await axios.post(
            `${backendUrl}/api/user/get-course-progress`,
            { courseId: course._id },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          let totalLectures = calculateNoOfLectures(course);

          const lectureCompleted = data.progressData
            ? data.progressData.lectureCompleted.length
            : 0;
          return { totalLectures, lectureCompleted };
        })
      );
      setProgressArray(tempProgressArray)
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect( () => {
    if(userData){
      fetchUserEnrolledCourses()
    }
  },[userData])

  useEffect( () => {
   if(enrolledCourses.length > 0){
    getCourseProgress()
   }
  },[enrolledCourses])

  return (
    <>
      <div className="md:px-36 px-4 pt-10">
        <h1 className="text-2xl font-semibold text-gray-800">My Enrollment</h1>

        <div className="mt-8">
          {/* Responsive design: hides table layout on smaller screens */}
          <table className="hidden md:table w-full border border-gray-300">
            <thead className="bg-gray-100 text-gray-800 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Course</th>
                <th className="px-4 py-3 font-semibold">Duration</th>
                <th className="px-4 py-3 font-semibold">Completed</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {enrolledCourses.map((course, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 flex items-center space-x-4">
                    <img
                      className="w-14 sm:w-20 md:w-24 rounded-lg object-cover"
                      src={course.courseThumbnail}
                      alt="thumbnail"
                    />
                    <p className="text-sm sm:text-base">{course.courseTitle}</p>
                    <Line
                      strokeWidth={4}
                      percent={
                        progressArray[index]
                          ? (progressArray[index].lectureCompleted * 100) /
                            progressArray[index].totalLectures
                          : 0
                      }
                      className="bg-gray-300 rounded-full"
                    />
                  </td>

                  <td className="px-4 py-3 text-sm sm:text-base">
                    {calculateCourseDuration(course)}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    <span className="font-medium text-gray-700">
                      {progressArray[index] &&
                        `${progressArray[index].lectureCompleted} / ${progressArray[index].totalLectures}`}
                    </span>{" "}
                    <span className="text-gray-500">Lectures</span>
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate("/player/" + course._id)}
                      className={`px-4 py-2 text-sm font-medium text-white  rounded-lg focus:outline-none ${
                        progressArray[index] &&
                        progressArray[index].lectureCompleted /
                          progressArray[index].totalLectures ===
                          1
                          ? "bg-green-500 hover:bg-green-700"
                          : " bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {progressArray[index] &&
                      progressArray[index].lectureCompleted /
                        progressArray[index].totalLectures ===
                        1
                        ? "Completed"
                        : " On Going"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile-optimized layout: Shows this section on smaller screens */}
          <div className="md:hidden space-y-4">
            {enrolledCourses.map((course, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <img
                    className="w-16 rounded-lg object-cover"
                    src={course.courseThumbnail}
                    alt="thumbnail"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {course.courseTitle}
                    </p>
                    <p className="text-sm text-gray-500">
                      {calculateCourseDuration(course)}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">4/10</span> Lectures
                  </p>
                  <button className="mt-2 w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none">
                    On Going
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyEnrollment;
