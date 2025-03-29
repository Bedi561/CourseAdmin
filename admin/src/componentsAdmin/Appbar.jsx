import { useNavigate } from "react-router-dom";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { isAdminLoading } from "../storeAdmin/selectors/isAdminLoading";
import { adminEmailState } from "../storeAdmin/selectors/adminEmail";
import axios from 'axios';
import { BASE_URL } from "../config.js";
import { adminState } from "../storeAdmin/atoms/admin";
import { FaBars, FaPlus, FaList, FaSignOutAlt, FaUser } from "react-icons/fa";
import Sidebar from "./Sidebar.jsx";
import { useState, useRef, useEffect } from "react";

function Appbar() {
    const navigate = useNavigate();
    const adminLoading = useRecoilValue(isAdminLoading);
    const adminEmail = useRecoilValue(adminEmailState);
    const setAdmin = useSetRecoilState(adminState);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [error, setError] = useState(null);
    const userMenuRef = useRef(null);

    // Handle clicks outside the user menu to close it
    useEffect(() => {
        function handleClickOutside(event) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Clear error after 5 seconds
    useEffect(() => {
        let timer;
        if (error) {
            timer = setTimeout(() => setError(null), 5000);
        }
        return () => clearTimeout(timer);
    }, [error]);

    const handleLogout = async () => {
        setLogoutLoading(true);
        setError(null);
        try {
            await axios.delete(`${BASE_URL}/courses`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            setAdmin({
                isLoading: false,
                adminEmail: null,
            });
            navigate('/');
        } catch (error) {
            console.error("Logout error:", error);
            setError("Failed to logout. Please try again.");
        } finally {
            setLogoutLoading(false);
        }
    };

    if (adminLoading) {
        return null;
    }

    if (!adminEmail) {
        return null;
    }

    return (
        <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
                    {/* Left section with logo and sidebar toggle */}
                    <div className="flex items-center space-x-4">
                        <button
                            className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            aria-expanded={sidebarOpen}
                            aria-label="Toggle sidebar"
                        >
                            <FaBars className="h-5 w-5" />
                        </button>
                        
                        <div 
                            className="flex items-center cursor-pointer group"
                            onClick={() => navigate("/admin/dashboard")}
                        >
                            <img 
                                src="/logo.png" 
                                alt="Coursera Logo" 
                                className="h-8 w-auto mr-2" 
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none';
                                }}
                            />
                            <h1 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                Coursera
                            </h1>
                        </div>
                    </div>

                    {/* Right section with navigation and user menu */}
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        {/* Navigation buttons - responsive hiding on smaller screens */}
                        <div className="hidden sm:flex items-center space-x-1">
                            <button
                                onClick={() => navigate("/admin/addcourse")}
                                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center"
                                aria-label="Add course"
                            >
                                {/* <FaPlus className="mr-1.5 h-4 w-4" /> */}
                                <span>Add Course</span>
                            </button>
                            <button
                                onClick={() => navigate("/admin/courses")}
                                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center"
                                aria-label="View courses"
                            >
                                {/* <FaList className="mr-1.5 h-4 w-4" /> */}
                                <span>Courses</span>
                            </button>
                        </div>

                        {/* User menu */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                aria-expanded={userMenuOpen}
                                aria-haspopup="true"
                            >
                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600">
                                    <FaUser className="h-4 w-4" />
                                </div>
                                <span className="hidden md:block max-w-xs truncate">
                                    {adminEmail}
                                </span>
                            </button>

                            {/* Dropdown menu */}
                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    {/* Mobile-only nav options */}
                                    <div className="sm:hidden border-b border-gray-100 pb-1">
                                        <button
                                            onClick={() => {
                                                navigate("/admin/addcourse");
                                                setUserMenuOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            {/* <FaPlus className="inline mr-2 h-4 w-4" /> */}
                                            Add Course
                                        </button>
                                        <button
                                            onClick={() => {
                                                navigate("/admin/courses");
                                                setUserMenuOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            {/* <FaList className="inline mr-2 h-4 w-4" /> */}
                                            Courses
                                        </button>
                                    </div>

                                    <button 
                                        onClick={() => {
                                            navigate("/admin/profile");
                                            setUserMenuOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Profile Settings
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        disabled={logoutLoading}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 focus:bg-red-50 transition-colors"
                                    >
                                        <div className="flex items-center">
                                            <FaSignOutAlt className="mr-2 h-4 w-4" />
                                            {logoutLoading ? "Logging out..." : "Logout"}
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Standalone logout button on larger screens */}
                        {/* <button
                            onClick={handleLogout}
                            disabled={logoutLoading}
                            className="hidden md:flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-70"
                            aria-label="Logout"
                        >
                            <FaSignOutAlt className="mr-1.5 h-4 w-4" />
                            {logoutLoading ? "Logging out..." : "Logout"}
                        </button> */}
                    </div>
                </div>
            </div>

            {/* Sidebar component */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Error notification */}
            {error && (
                <div className="fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md z-50 animate-fadeIn">
                    <div className="flex">
                        <div className="py-1">
                            <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold">Error</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Appbar;