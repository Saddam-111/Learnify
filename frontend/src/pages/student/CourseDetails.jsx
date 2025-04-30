import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import Footer from "../../components/student/Footer";
import Youtube from "react-youtube";
import axios from "axios";
import { toast } from "react-toastify";

const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [enrolled, setEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);

  const {
    calculateRating,
    calculateChapterTime,
    currency,
    backendUrl,
    userData,
    getToken,
  } = useContext(AppContext);

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/${id}`);
      if (data.success) {
        setCourseData(data.courseData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch course data");
    }
  };

  const toggleSection = (index) => {
    setOpenSection((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const enrolledCourse = async () => {
    try {
      if (!userData) {
        return toast.warn("Login to Enroll");
      }
      if (enrolled) {
        return toast.warn("Already Enrolled");
      }
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/purchase`,
        { courseId: courseData._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        window.location.replace(data.session_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Enrollment failed");
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, []);

  useEffect(() => {
    if (userData && courseData) {
      setEnrolled(userData?.enrolledCourse?.includes(courseData._id));
    }
  }, [userData, courseData]);

  return courseData ? (
    <>
      <div className="relative px-4 sm:px-8 md:px-16 lg:px-20 xl:px-28 pt-10 md:pt-16">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-cyan-100/25 -z-10"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 z-10 text-gray-600">
            <h1 className="font-bold text-gray-800 text-2xl md:text-3xl">
              {courseData.courseTitle}
            </h1>
            <p
              className="pt-4 text-sm md:text-base"
              dangerouslySetInnerHTML={{
                __html: courseData.courseDescription?.slice(0, 200),
              }}
            ></p>

            <div className="flex items-center flex-wrap space-x-2 pt-4 text-sm">
              <p>{calculateRating(courseData)}</p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    className="w-4 h-4"
                    src={
                      i < Math.floor(calculateRating(courseData))
                        ? assets.star
                        : assets.star_blank
                    }
                    alt="star"
                  />
                ))}
              </div>
              <p className="text-blue-500">
                ({courseData.courseRatings.length}{" "}
                {courseData.courseRatings.length > 1 ? "ratings" : "rating"})
              </p>
              <p>
                {courseData.enrolledStudents?.length ?? 0}{" "}
                {courseData.enrolledStudents?.length > 1
                  ? "students"
                  : "student"}
              </p>
            </div>

            <p className="text-sm pt-2">
              Course by:{" "}
              <span className="text-blue-600 underline">
                {courseData.educator?.name}
              </span>
            </p>

            <div className="pt-8">
              <h2 className="text-xl font-semibold text-gray-800">
                Course Structure
              </h2>
              <div className="pt-5">
                {courseData.courseContent?.map((chapter, index) => (
                  <div
                    key={index}
                    className="border border-gray-300 bg-white mb-2 rounded overflow-hidden"
                  >
                    <div
                      className="flex items-center justify-between px-4 py-3 cursor-pointer"
                      onClick={() => toggleSection(index)}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={assets.down_arrow_icon}
                          alt="arrow-icon"
                          className={`w-4 transition-transform ${
                            openSection[index] ? "rotate-180" : ""
                          }`}
                        />
                        <p className="font-medium text-sm md:text-base">
                          {chapter.chapterTitle}
                        </p>
                      </div>
                      <p className="text-sm">
                        {chapter.chapterContent.length} lectures -{" "}
                        {calculateChapterTime(chapter)}
                      </p>
                    </div>

                    <div
                      className={`transition-all duration-300 ${
                        openSection[index] ? "max-h-96" : "max-h-0"
                      } overflow-hidden`}
                    >
                      <ul className="list-disc pl-6 pr-4 py-2 text-gray-600 border-t border-gray-300">
                        {chapter.chapterContent.map((lecture, i) => (
                          <li key={i} className="flex items-start gap-2 py-1">
                            <img
                              src={assets.play_icon}
                              alt="play-icon"
                              className="w-4 h-4 mt-1"
                            />
                            <div className="flex justify-between w-full text-gray-800">
                              <p>{lecture.lectureTitle}</p>
                              <div className="flex gap-2 items-center">
                                {lecture.isPreviewFree ? (
                                  <p
                                    className="text-blue-500 cursor-pointer"
                                    onClick={() =>
                                      setPlayerData({
                                        videoId:
                                          lecture.lectureUrl.split("/").pop(),
                                      })
                                    }
                                  >
                                    Preview
                                  </p>
                                ) : enrolled ? (
                                  <p
                                    className="text-blue-500 cursor-pointer"
                                    onClick={() =>
                                      setPlayerData({
                                        videoId:
                                          lecture.lectureUrl.split("/").pop(),
                                      })
                                    }
                                  >
                                    Watch
                                  </p>
                                ) : userData ? (
                                  <div className="text-gray-400 italic flex items-center gap-1">
                                    <img
                                      src={assets.lock_icon}
                                      alt="lock"
                                      className="w-3 h-3"
                                    />
                                    Enroll to unlock
                                  </div>
                                ) : (
                                  <div className="text-gray-400 italic">
                                    Login to view
                                  </div>
                                )}
                                <p>
                                  {humanizeDuration(
                                    lecture.lectureDuration * 60 * 1000,
                                    { units: ["h", "m"] }
                                  )}
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-10">
              <h3 className="text-xl font-semibold text-gray-800">
                Course Description
              </h3>
              <div
                className="pt-4 text-sm md:text-base text-gray-600 leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{
                  __html: courseData.courseDescription,
                }}
              ></div>
            </div>
          </div>

          {/* Right Column: Course Sidebar */}
          <div className="w-full bg-white rounded shadow-md h-fit sticky top-28 mx-auto lg:mx-0">
            {playerData ? (
              <Youtube
                videoId={playerData.videoId}
                opts={{ playerVars: { autoplay: 1 } }}
                iframeClassName="w-full aspect-video"
              />
            ) : (
              <img
                src={courseData.courseThumbnail}
                alt="thumbnail"
                className="w-full rounded-t"
              />
            )}

            <div className="p-5">
              <div className="flex items-center gap-2">
                <img
                  className="w-4"
                  src={assets.time_left_clock_icon}
                  alt="time"
                />
                <p className="text-red-500 text-sm">
                  <span className="font-medium">3 days</span> left at this price!
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <p className="text-2xl font-semibold text-gray-800">
                  {currency}{" "}
                  {(
                    courseData.coursePrice -
                    (courseData.discount * courseData.coursePrice) / 100
                  ).toFixed(2)}
                </p>
                <p className="line-through text-gray-500">
                  {currency}
                  {courseData.coursePrice}
                </p>
                <p className="text-lg text-gray-800">{courseData.discount}% off</p>
              </div>

              <button
                onClick={enrolledCourse}
                className="mt-5 w-full py-3 rounded bg-blue-600 hover:bg-blue-700 transition text-white font-medium"
              >
                {!userData
                  ? "Login to Enroll"
                  : enrolled
                  ? "Already Enrolled"
                  : "Enroll Now"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;
