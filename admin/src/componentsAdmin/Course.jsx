/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { FaEdit, FaDollarSign } from 'react-icons/fa';
import { BASE_URL } from "../config.js";
import { courseState } from "../storeAdmin/atoms/course";
import { courseTitle, coursePrice, isCourseLoading, courseImage } from "../storeAdmin/selectors/course";
import Appbar from "./Appbar.jsx";
import Sidebar from "./Sidebar.jsx";
import Modal from "./Modal.jsx";

function Course() {
    let { courseId } = useParams();
    const [course, setCourse] = useRecoilState(courseState);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        axios.get(`${BASE_URL}/course/${courseId}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
            setCourse({ isLoading: false, course: res.data.course });
        })
        .catch(e => {
            setCourse({ isLoading: false, course: null });
        });
    }, [courseId, setCourse]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCourse(prev => ({ ...prev, course: { ...prev.course, [name]: value } }));
    };

    const handleLessonChange = (index, field, value) => {
        const updatedLessons = [...course.course.lessons];
        updatedLessons[index] = { ...updatedLessons[index], [field]: value };
        setCourse(prev => ({ ...prev, course: { ...prev.course, lessons: updatedLessons } }));
    };

    const addLesson = () => {
        setCourse(prev => ({
            ...prev,
            course: {
                ...prev.course,
                lessons: [...prev.course.lessons, { title: "", content: "", duration: 0, videoLink: "", videoFile: null, pdfFile: null }]
            }
        }));
    };

    const deleteLesson = (index) => {
        const updatedLessons = [...course.course.lessons];
        updatedLessons.splice(index, 1);
        setCourse(prev => ({ ...prev, course: { ...prev.course, lessons: updatedLessons } }));
    };

    const handleFileChange = (e, index, type) => {
        const { files } = e.target;
        const updatedLessons = [...course.course.lessons];
        if (type === 'video') {
            updatedLessons[index].videoFile = files[0];
        } else if (type === 'pdf') {
            updatedLessons[index].pdfFile = files[0];
        }
        setCourse(prev => ({ ...prev, course: { ...prev.course, lessons: updatedLessons } }));
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("title", course.course.title);
            formData.append("description", course.course.description);
            formData.append("price", course.course.price);
            formData.append("imageLink", course.course.imageLink);
            formData.append("category", course.course.category);
            formData.append("tags", course.course.tags);

            course.course.lessons.forEach((lesson, index) => {
                formData.append(`lessons[${index}][title]`, lesson.title);
                formData.append(`lessons[${index}][content]`, lesson.content);
                formData.append(`lessons[${index}][duration]`, lesson.duration);
                formData.append(`lessons[${index}][videoLink]`, lesson.videoLink);
                if (lesson.videoFile) {
                    formData.append(`lessons[${index}][videoFile]`, lesson.videoFile);
                }
                if (lesson.pdfFile) {
                    formData.append(`lessons[${index}][pdfFile]`, lesson.pdfFile);
                }
            });

            const response = await axios.put(`${BASE_URL}/courses/${courseId}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + token,
                },
            });
            

            if (response.status === 200) {
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error("Error updating course:", error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (course.isLoading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Appbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <GrayTopper />
                    <div className="container mx-auto px-6 py-8">
                        <h3 className="text-gray-700 text-3xl font-medium mb-6">Edit Course</h3>
                        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="text"
                                    name="title"
                                    value={course.course.title}
                                    onChange={handleInputChange}
                                    placeholder="Course Title"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                                <textarea
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    name="description"
                                    value={course.course.description}
                                    onChange={handleInputChange}
                                    placeholder="Course Description"
                                    rows="3"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="number"
                                    name="price"
                                    value={course.course.price}
                                    onChange={handleInputChange}
                                    placeholder="Course Price"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Image Link</label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="text"
                                    name="imageLink"
                                    value={course.course.imageLink}
                                    onChange={handleInputChange}
                                    placeholder="Course Image URL"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="text"
                                    name="category"
                                    value={course.course.category}
                                    onChange={handleInputChange}
                                    placeholder="Course Category"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Tags</label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="text"
                                    name="tags"
                                    value={course.course.tags}
                                    onChange={handleInputChange}
                                    placeholder="Comma-separated tags"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Lessons</label>
                                {course.course.lessons.map((lesson, index) => (
                                    <div key={index} className="mb-4 p-4 border rounded">
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                            placeholder="Lesson Title"
                                            value={lesson.title}
                                            onChange={(e) => handleLessonChange(index, 'title', e.target.value)}
                                        />
                                        <textarea
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                            placeholder="Lesson Content"
                                            value={lesson.content}
                                            onChange={(e) => handleLessonChange(index, 'content', e.target.value)}
                                            rows="3"
                                        />
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                            placeholder="Video Link (optional)"
                                            value={lesson.videoLink}
                                            onChange={(e) => handleLessonChange(index, 'videoLink', e.target.value)}
                                        />
                                        <div className="flex items-center">
                                            <label className="mr-2">Duration (minutes)</label>
                                            <input
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                type="number"
                                                placeholder="Duration"
                                                value={lesson.duration}
                                                onChange={(e) => handleLessonChange(index, 'duration', e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Upload Video File</label>
                                            <input
                                                type="file"
                                                onChange={(e) => handleFileChange(e, index, 'video')}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Upload PDF File</label>
                                            <input
                                                type="file"
                                                onChange={(e) => handleFileChange(e, index, 'pdf')}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                        </div>
                                        <button
                                            className="text-red-500"
                                            onClick={() => deleteLesson(index)}
                                        >
                                            Delete Lesson
                                        </button>
                                    </div>
                                ))}
                                <button
                                    className="py-2 px-4 bg-blue-500 text-white rounded"
                                    onClick={addLesson}
                                >
                                    Add Lesson
                                </button>
                            </div>
                            <button
                                className="py-2 px-4 bg-green-500 text-white rounded"
                                onClick={handleSubmit}
                            >
                                Update Course
                            </button>
                        </div>
                    </div>
                </main>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <h2 className="text-2xl font-bold mb-4">Success!</h2>
                <p>Your course has been updated successfully.</p>
            </Modal>
        </div>
    );
}

function GrayTopper() {
    const title = useRecoilValue(courseTitle);
    return (
        <div className="bg-gray-800 py-24">
            <div className="container mx-auto px-6">
                <h1 className="text-4xl font-semibold text-white text-center">{title}</h1>
            </div>
        </div>
    );
}

function CourseCard() {
    const title = useRecoilValue(courseTitle);
    const imageLink = useRecoilValue(courseImage);
    const price = useRecoilValue(coursePrice);

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <img src={imageLink} alt={title} className="w-full h-48 object-cover" />
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{title}</h2>
                <div className="flex items-center text-gray-700">
                    <FaDollarSign className="mr-1" />
                    <span className="font-bold">{price}</span>
                </div>
            </div>
        </div>
    );
}

export default Course;

