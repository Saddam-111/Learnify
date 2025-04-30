import React, { useContext, useEffect, useRef, useState } from 'react'
import uniqid from 'uniqid'
import Quill from 'quill'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import {toast} from 'react-toastify'
import axios from 'axios'

const AddCourse = () => {
  const quillRef = useRef(null)
  const editorRef = useRef(null)
  const {backendUrl, getToken} = useContext(AppContext)


  const [courseTitle, setCourseTitle] = useState('')
  const [coursePrice, setCoursePrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [image, setImage] = useState(null)
  const [chapters, setChapters] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [currentChapterId, setCurrentChapterId] = useState('')

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false,
  })

  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter Chapter Name:')
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        }
        setChapters([...chapters, newChapter])
      }
    } else if (action === 'remove') {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId))
    } else if (action === 'toggle') {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter
        )
      )
    }
  }

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId)
      setShowPopup(true)
    } else if (action === 'remove') {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? {
                ...chapter,
                chapterContent: chapter.chapterContent.filter((_, idx) => idx !== lectureIndex),
              }
            : chapter
        )
      )
    }
  }

  const addLecture = () => {
    if (!lectureDetails.lectureTitle || !lectureDetails.lectureDuration || !lectureDetails.lectureUrl) return

    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder:
              chapter.chapterContent.length > 0
                ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1
                : 1,
            lectureId: uniqid(),
          }
          return {
            ...chapter,
            chapterContent: [...chapter.chapterContent, newLecture],
          }
        }
        return chapter
      })
    )
    setShowPopup(false)
    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
    })
  }

  // const handleForm = (e) => {
  //   e.preventDefault()
  //   const courseData = {
  //     title: courseTitle,
  //     price: coursePrice,
  //     discount,
  //     chapters,
  //     image,
  //     description: quillRef.current?.root?.innerHTML || '',
  //   }


  //   console.log('Submitting Course:', courseData)
  //   // Submit logic here
  // }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      if(!image){
        toast.error('Thumbnail is not selected')
      }

      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      }

      const formData = new FormData()
      formData.append('courseData', JSON.stringify(courseData))
      formData.append('image', image)

      const token = await getToken()
      const {data} = await axios.post(backendUrl + '/api/educator/add-course', formData, {headers: {Authorization: `Bearer ${token}` }})

      if(data.success){
        toast.success(data.message)
        setCourseTitle('')
        setCoursePrice(0)
        setDiscount(0)
        setImage(null)
        setChapters([])
        quillRef.current.root.innerHTML = ""
      } else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      })
    }
  }, [])

  return (
    <div className='p-4 md:p-8 bg-gray-50 min-h-screen'>
      <div className='max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10'>
        <h2 className='text-2xl font-semibold mb-6'>Add New Course</h2>
        <form onSubmit={handleSubmit} className='space-y-6'>

          {/* Course Title */}
          <div>
            <label className='block text-sm font-medium mb-1'>Course Title</label>
            <input
              type='text'
              placeholder='Type here...'
              value={courseTitle}
              onChange={e => setCourseTitle(e.target.value)}
              className='w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>

          {/* Course Description */}
          <div>
            <label className='block text-sm font-medium mb-1'>Course Description</label>
            <div ref={editorRef} className='min-h-[200px] border border-gray-300 rounded-lg p-2 bg-white' />
          </div>

          {/* Price and Thumbnail */}
          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium mb-1'>Course Price ($)</label>
              <input
                type='number'
                value={coursePrice}
                onChange={e => setCoursePrice(Number(e.target.value))}
                placeholder='0'
                className='w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Course Thumbnail</label>
              <label htmlFor='thumbnailImage' className='cursor-pointer flex flex-col gap-2'>
                <img src={assets.file_upload_icon} alt="upload" className='w-10' />
                <input
                  type='file'
                  id='thumbnailImage'
                  accept='image/*'
                  hidden
                  onChange={e => setImage(e.target.files[0])}
                />
                {image && (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Thumbnail"
                    className='w-32 h-20 object-cover border rounded-lg'
                  />
                )}
              </label>
            </div>
          </div>

          {/* Discount */}
          <div>
            <label className='block text-sm font-medium mb-1'>Discount (%)</label>
            <input
              type='number'
              min={0}
              max={100}
              value={discount}
              onChange={e => setDiscount(Number(e.target.value))}
              className='w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='0'
            />
          </div>

          {/* Chapters Section */}
          <div>
            <h3 className='text-lg font-medium mb-2'>Chapters</h3>
            <div className='space-y-4'>
              {chapters.map((chapter, chapterIndex) => (
                <div key={chapter.chapterId} className='bg-gray-100 rounded-xl p-4 shadow-sm'>
                  <div className='flex justify-between items-center'>
                    <div className='font-semibold text-sm flex items-center gap-2'>
                      <img
                        onClick={() => handleChapter('toggle', chapter.chapterId)}
                        src={assets.dropdown_icon}
                        className='w-4 cursor-pointer'
                      />
                      {chapterIndex + 1}. {chapter.chapterTitle}
                    </div>
                    <div className='flex gap-3 items-center text-sm'>
                      <span className='text-gray-500'>{chapter.chapterContent.length} Lectures</span>
                      <img
                        onClick={() => handleChapter('remove', chapter.chapterId)}
                        src={assets.cross_icon}
                        className='w-4 cursor-pointer'
                      />
                    </div>
                  </div>

                  {!chapter.collapsed && (
                    <div className='mt-3 space-y-2'>
                      {chapter.chapterContent.map((lecture, lectureIndex) => (
                        <div key={lecture.lectureId} className='text-sm flex justify-between'>
                          <span>
                            {lectureIndex + 1}. {lecture.lectureTitle} - {lecture.lectureDuration} mins -{' '}
                            <a href={lecture.lectureUrl} className='text-blue-600 underline'>link</a> -{' '}
                            {lecture.isPreviewFree ? 'Free Preview' : 'Paid'}
                          </span>
                          <img
                            onClick={() => handleLecture('remove', chapter.chapterId, lectureIndex)}
                            src={assets.cross_icon}
                            className='w-4 cursor-pointer'
                          />
                        </div>
                      ))}
                      <button
                        type='button'
                        className='text-blue-600 hover:underline text-sm'
                        onClick={() => handleLecture('add', chapter.chapterId)}
                      >
                        + Add Lecture
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <button
                type='button'
                className='text-blue-600 text-sm hover:underline'
                onClick={() => handleChapter('add')}
              >
                + Add Chapter
              </button>
            </div>
          </div>

          {/* Add Course Button */}
          <div className='text-right'>
            <button type='submit' className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all'>
              Add Course
            </button>
          </div>
        </form>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className='fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50'>
          <div className='bg-white w-full max-w-md p-6 rounded-2xl shadow-xl relative'>
            <img
              src={assets.cross_icon}
              alt="Close"
              className='absolute top-4 right-4 w-5 cursor-pointer'
              onClick={() => setShowPopup(false)}
            />
            <h2 className='text-xl font-semibold mb-4'>+ Add Lecture</h2>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm mb-1'>Lecture Title</label>
                <input
                  type='text'
                  value={lectureDetails.lectureTitle}
                  onChange={e => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
                  className='w-full border border-gray-300 rounded-lg px-4 py-2'
                />
              </div>

              <div>
                <label className='block text-sm mb-1'>Duration (minutes)</label>
                <input
                  type='number'
                  value={lectureDetails.lectureDuration}
                  onChange={e => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
                  className='w-full border border-gray-300 rounded-lg px-4 py-2'
                />
              </div>

              <div>
                <label className='block text-sm mb-1'>Lecture URL</label>
                <input
                  type='text'
                  value={lectureDetails.lectureUrl}
                  onChange={e => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
                  className='w-full border border-gray-300 rounded-lg px-4 py-2'
                />
              </div>

              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={lectureDetails.isPreviewFree}
                  onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
                  className='scale-125'
                />
                <span className='text-sm'>Is Preview Free?</span>
              </div>

              <button
                type='button'
                onClick={addLecture}
                className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700'
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddCourse
