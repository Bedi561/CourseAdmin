/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaGraduationCap } from 'react-icons/fa';
import { BASE_URL } from "../config.js";
import Appbar from "./Appbar.jsx";
import Sidebar from "./Sidebar.jsx";

function Courses() {
    const [courses, setCourses] = useState([]);

    const init = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/courses/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setCourses(response.data.courses);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Appbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="container mx-auto px-6 py-8">
                        <h3 className="text-gray-700 text-3xl font-medium mb-6">Courses</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {courses.map(course => (
                                <Course key={course._id} course={course} />
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

function Course({ course }) {
    const navigate = useNavigate();

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
    )
}

export default Courses;

