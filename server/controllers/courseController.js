import Course from "../models/Course.js";


//Get all Courses
export const getAllCourses = async (req , res ) => {
  try {
    const courses = await Course.find({isPublished: true}).select(['-courseContent', '-enrolledStudents']).populate({path:'educator'})

    if(!courses.length){
      return res.status(404).json({
        success: false,
        message: "No Course Found"
      })
    }

    res.json({
      success: true,
      courses
    })
  } catch (error) {
    res.json({
      success: false, 
      message: 'Failed in loading courses'
    })
  }
}



//Get course by Id

export const getCourseId = async(req , res ) => {
  const {id} = req.params
  try {
    const courseData = await Course.findById(id).populate({path: 'educator'})

    //remove lectureUrl if isPreviewFree is false
    courseData.courseContent.forEach(chapter => {
      chapter.chapterContent.forEach(lecture => {
        if(!lecture.isPreviewFree){
          lecture.lectureUrl = ''
        }
      })
    })
    res.json({
      success: true,
      courseData
    })
  } catch (error) {
    res.json({
      success: false, 
      message: 'Loading failed'
    })
  }
}



