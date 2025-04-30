import {clerkClient} from '@clerk/express'
import Course from '../models/Course.js'
import {v2 as cloudinary} from 'cloudinary'
import Purchase from '../models/Purchase.js'
import User from '../models/User.js'




export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: 'educator',
      }
    })
    res.status(200).json({
      success: true,
      message: "You can publish a course now"
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed in role changing'
    })
  }
}






// Add new Course
export const addCourse = async (req, res) => {
  try {
    const {courseData} = req.body
    const imageFile = req.file
    const educatorId = req.auth.userId

    if(!imageFile){
      return res.status(404).json({
        success: false, 
        message: 'Thumbnail is not attached'
      })
    }

    const parsedCourseData = await JSON.parse(courseData);
    parsedCourseData.educator = educatorId;
    const newCourse =  await Course.create(parsedCourseData)
    const imageUpload = await cloudinary.uploader.upload(imageFile.path)
    newCourse.courseThumbnail =  imageUpload.secure_url

    await newCourse.save();

    res.json({
      success: true,
      message: "Course added"
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed in course adding'
    })
  }
}



//get educator Courses
export const getEducatorCourses = async(req , res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({educator});
    res.json({
      success: true,
      courses
    })
  } catch (error) {
    return res.json({
      success: false, 
      message: 'Failed in courses loading'
    })
  }
}







//Get educator dashboard data (total earning, enrolled student, no of courses)


export const educatorDashboardData = async(req , res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({educator});
    const totalCourses = courses.length;

    const courseIds = courses.map( (course) => course._id);

    //calculate total earnings from purchase
    const purchase = await Purchase.find({
      courseId: {$in: courseIds},
      status: 'completed'
    });

    const totalEarnings = purchase.reduce( (sum, purchase) => sum + purchase.amount, 0);

    //collect unique enrolled student IDs with their course title
    const enrolledStudentData = [];
    for(const course of courses){
      const students = await User.find({
        _id: {$in: course.enrolledStudents}
      }, 'name imageUrl')

      students.forEach(student => {
        enrolledStudentData.push({
          courseTitle: course.courseTitle,
          student
        })
      })
    }
    res.json({
      success: true, dashboardData: {
        totalEarnings, enrolledStudentData, totalCourses,
      }
    })

  } catch (error) {
    res.json({
      success: false,
      message: "Error in Dashboard controller"
    })
  }
}



// get enrolled students Data with Purchase Data 
export const getEnrolledStudentData = async (req , res ) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({educator});
    const courseIds = courses.map(course => course._id);

    const purchases = await Purchase.find({
      courseId: {$in: courseIds},
      status: 'completed'
    }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle')


    const enrolledStudents = purchases.map(purchase => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt
    }));

    res.json({
      success: true,
      enrolledStudents
    })

  } catch (error) {
    res.json({
      success: false,
      message: 'Error in loading enrolled students data'
    })
  }
}