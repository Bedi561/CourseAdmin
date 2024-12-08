import { useNavigate } from "react-router-dom";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { isAdminLoading } from "../storeAdmin/selectors/isAdminLoading";
import { adminEmailState } from "../storeAdmin/selectors/adminEmail";
import axios from 'axios';
import { BASE_URL } from "../config.js";
import { adminState } from "../storeAdmin/atoms/admin";
import { FaBars } from "react-icons/fa";
import Sidebar from "./Sidebar.jsx";
import { useState } from "react";

function Appbar() {
    const navigate = useNavigate();
    const adminLoading = useRecoilValue(isAdminLoading);
    const adminEmail = useRecoilValue(adminEmailState);
    const setAdmin = useSetRecoilState(adminState);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (adminLoading) {
        return null;
    }

    if (adminEmail) {
        return (
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Sidebar */}
                        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                        <div className="flex-shrink-0 flex items-center">
                            {/* Sidebar toggle button */}
                            <button
                                className="text-gray-500 hover:text-gray-600 mr-4"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                            >
                                <FaBars className="h-6 w-6" />
                            </button>
                            {/* Coursera h1 tag */}
                            <h1
                                className="text-xl font-bold text-gray-800 cursor-pointer"
                                onClick={() => navigate("/")}
                            >
                                Coursera
                            </h1>
                        </div>

                        <div className="flex items-center">
                            <button
                                onClick={() => navigate("/admin/addcourse")}
                                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:text-gray-900 focus:bg-gray-100"
                            >
                                Add course
                            </button>
                            <button
                                onClick={() => navigate("/admin/courses")}
                                className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:text-gray-900 focus:bg-gray-100"
                            >
                                Courses
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        await axios.delete(`${BASE_URL}/courses`, {
                                            headers: {
                                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                                            },
                                        });
                                        localStorage.removeItem('token');
                                        setAdmin({
                                            isLoading: false,
                                            adminEmail: null,
                                        });
                                        navigate('/');
                                    } catch (error) {
                                        console.error(error);
                                    }
                                }}
                                className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    return null;
}

export default Appbar;
