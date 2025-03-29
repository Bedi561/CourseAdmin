/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaGraduationCap, FaPlus } from 'react-icons/fa';
import { BASE_URL } from "../config.js";
import Appbar from "./Appbar.jsx";
import Sidebar from "./Sidebar.jsx";

function Courses() {
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();
    
    const init = async () => {
        try {
            console.log("Fetching courses...");
            const response = await axios.get(`${BASE_URL}/my-courses`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log("API Response:", response.data);
            setCourses(response.data.courses);
            console.log("Courses set to state:", response.data.courses);
        } catch (error) {
            console.error("Error fetching your courses:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
            }
            setCourses([]); // Clear state if there's an error
        }
    };

    useEffect(() => {
        init();
        // Let's also log the token to make sure it's available
        console.log("Token available:", !!localStorage.getItem('token'));
    }, []);

    console.log("Rendering with courses:", courses);

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Appbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="container mx-auto px-6 py-8">
                        {courses.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {courses.map(course => (
                                    <Course key={course._id} course={course} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center mt-12">
                                <p className="text-gray-500 text-lg mb-4">You haven&apos;t created any courses yet.</p>
                                <button 
                                    onClick={() => navigate("/admin/addCourse")}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg flex items-center"
                                >
                                    <FaPlus className="mr-2" />
                                    Create Your First Course
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

function Course({ course }) {
    const navigate = useNavigate();
    
    console.log("Rendering course:", course);
    
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={course.imageLink} alt={course.title} className="w-full h-48 object-cover" />
            <div className="p-6">
                <h4 className="text-xl font-semibold mb-2">{course.title}</h4>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center">
                        <FaGraduationCap className="mr-2" />
                        {course.students ? course.students.length : 0} students
                        {course.totalStudents && <span className="ml-2">(Total: {course.totalStudents})</span>}
                    </span>
                    <button 
                        onClick={() => navigate("/admin/course/" + course._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
                    >
                        <FaEdit className="mr-2" />
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Courses;