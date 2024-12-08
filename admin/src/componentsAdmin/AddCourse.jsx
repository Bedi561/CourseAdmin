import React, { useState } from "react";
import axios from "axios";
import { FaBook, FaDollarSign, FaImage, FaTags, FaClock } from 'react-icons/fa';
import { BASE_URL } from "../config.js";
import Appbar from "./Appbar.jsx";
import Sidebar from "./Sidebar.jsx";

function AddCourse() {
    const [course, setCourse] = useState({
        title: "",
        description: "",
        price: 0,
        imageLink: "",
        published: false,
        category: "",
        tags: "",
        lessons: [{ title: "", content: "", duration: 0, videoLink: "" }] // Adding videoLink to the lesson schema
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCourse(prev => ({ ...prev, [name]: value }));
        console.log(`Input Change - ${name}:`, value);
    };

    const handleLessonChange = (index, field, value) => {
        const updatedLessons = [...course.lessons];
        updatedLessons[index] = { ...updatedLessons[index], [field]: value };
        setCourse(prev => ({ ...prev, lessons: updatedLessons }));
        console.log(`Lesson Change - Index: ${index}, Field: ${field}, Value:`, value);
    };

    const addLesson = () => {
        setCourse(prev => ({
            ...prev,
            lessons: [...prev.lessons, { title: "", content: "", duration: 0, videoLink: "" }]
        }));
        console.log("Added new lesson. Total lessons now:", course.lessons.length);
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            console.log("Token:", token); // Log the token
            console.log("Submitting course data:", course);
            const response = await axios.post(`${BASE_URL}/courses`, course, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + token
                }
            });
            console.log("Course added successfully:", response.data);
            alert("Course added successfully!");
        } catch (error) {
            console.error("Error adding course:", error);
            alert("Failed to add course. Please check your input and try again.");
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* <Sidebar /> */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Appbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="container mx-auto px-6 py-8">
                        <h3 className="text-gray-700 text-3xl font-medium mb-6">Add New Course</h3>
                        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            {/* Course Details Input Fields */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                    <FaBook className="inline mr-2" />
                                    Title
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="title"
                                    type="text"
                                    name="title"
                                    value={course.title}
                                    onChange={handleInputChange}
                                    placeholder="Course Title"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                    Description
                                </label>
                                <textarea
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="description"
                                    name="description"
                                    value={course.description}
                                    onChange={handleInputChange}
                                    placeholder="Course Description"
                                    rows="3"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                                    <FaDollarSign className="inline mr-2" />
                                    Price
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="price"
                                    type="number"
                                    name="price"
                                    value={course.price}
                                    onChange={handleInputChange}
                                    placeholder="Course Price"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageLink">
                                    <FaImage className="inline mr-2" />
                                    Image Link
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="imageLink"
                                    type="text"
                                    name="imageLink"
                                    value={course.imageLink}
                                    onChange={handleInputChange}
                                    placeholder="Course Image URL"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                                    Category
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="category"
                                    type="text"
                                    name="category"
                                    value={course.category}
                                    onChange={handleInputChange}
                                    placeholder="Course Category"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
                                    <FaTags className="inline mr-2" />
                                    Tags
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="tags"
                                    type="text"
                                    name="tags"
                                    value={course.tags}
                                    onChange={handleInputChange}
                                    placeholder="Comma-separated tags"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Published
                                </label>
                                <input
                                    type="checkbox"
                                    name="published"
                                    checked={course.published}
                                    onChange={(e) => {
                                        console.log("Checkbox checked:", e.target.checked); // Log the current state of the checkbox
                                        setCourse(prev => ({ ...prev, published: e.target.checked }));
                                    }}
                                    className="mr-2 leading-tight"
                                />

                                <span className="text-sm">
                                    Make this course public
                                </span>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Lessons
                                </label>
                                {course.lessons.map((lesson, index) => (
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
                                            <FaClock className="mr-2" />
                                            <input
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                type="number"
                                                placeholder="Duration (minutes)"
                                                value={lesson.duration}
                                                onChange={(e) => handleLessonChange(index, 'duration', parseInt(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div className="flex justify-between">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        type="button"
                                        onClick={addLesson}
                                    >
                                        Add Lesson
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="button"
                                    onClick={handleSubmit}
                                >
                                    Add Course
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AddCourse;
