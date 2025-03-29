/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import axios from 'axios';

import Signin from "./componentsAdmin/Signin.jsx";
import Signup from "./componentsAdmin/Signup.jsx";
import AddCourse from "./componentsAdmin/AddCourse.jsx";
import Courses from "./componentsAdmin/Courses";
import Course from "./componentsAdmin/Course";
import Admin from './componentsAdmin/Admin.jsx';
// import Students from './componentsAdmin/Students.jsx';
import Dash from './componentsAdmin/Dash.jsx';
import TokenExpiredModal from './componentsAdmin/TokenExpiryModal'; // Import the modal

import { adminState } from "./storeAdmin/atoms/admin.js";
import { BASE_URL } from "./config.js";
import useApiClient from './apiClient'; // Import useApiClient to manage API calls and modal state

function App() {
    return (
        <RecoilRoot>
            <div style={{
                width: "100vw",
                height: "100vh",
                backgroundColor: "#eeeeee"
            }}>
                <Router>
                    <InitAdmin />
                    <Routes>
                        <Route path="/" element={<Signin />} />
                        <Route path="/admin/signin" element={<Signin />} />
                        <Route path="/admin/signup" element={<Signup />} />
                        <Route path="/admin/dashboard" element={<Dash />} />
                        <Route path="/admin/main" element={<Admin />} />
                        <Route path="/admin/addcourse" element={<AddCourse />} />
                        <Route path="/admin/courses" element={<Courses />} />
                        <Route path="/admin/course/:courseId" element={<Course />} />
                        {/* <Route path="/admin/students" element={<Students />} /> */}
                    </Routes>
                </Router>
            </div>
        </RecoilRoot>
    );
}

function InitAdmin() {
    const setAdmin = useSetRecoilState(adminState);
    const location = useLocation();
    const { showModal, setShowModal } = useApiClient();
    const [error, setError] = useState(null);

    useEffect(() => {
        const initAdmin = async () => {
            console.log("=== Starting ADMIN Data Initialization ===");
            setError(null);

            const token = localStorage.getItem("token");
            const refreshToken = localStorage.getItem("refreshToken");

            if (!token) {
                console.warn("No token found. Aborting admin data initialization.");
                setAdmin({ isLoading: false, adminEmail: null });
                return;
            }

            setAdmin({ isLoading: true, adminEmail: null });

            try {
                console.log("Attempting to fetch admin data with access token...");
                const response = await fetchAdminData(token);
                handleSuccessfulResponse(response);
            } catch (error) {
                await handleFetchError(error, token, refreshToken);
            } finally {
                console.log("=== Admin Data Initialization Process Complete ===");
            }
        };

        // Helper function to fetch admin data
        const fetchAdminData = async (tokenToUse) => {
            try {
                return await axios.get(`${BASE_URL}/me`, {
                    headers: { 
                        "Content-type": "application/json",
                        "Authorization": "Bearer " + tokenToUse,
                    },
                });
            } catch (error) {
                // Add request details to error for better debugging
                error.requestDetails = {
                    url: `${BASE_URL}/me`,
                    method: 'GET',
                    headers: { Authorization: 'Bearer ' + tokenToUse.substring(0, 10) + '...' }
                };
                throw error;
            }
        };

        // Handle successful response
        const handleSuccessfulResponse = (response) => {
            if (response.data && response.data.username) {
                console.log("Admin data fetched successfully:", response.data);
                setAdmin({ isLoading: false, adminEmail: response.data.username });
            } else {
                console.warn("Admin data not found in response:", response.data);
                setAdmin({ isLoading: false, adminEmail: null });
                setError("Invalid response format from server");
            }
        };

        // Handle fetch errors with appropriate handling for different scenarios
        const handleFetchError = async (error, token, refreshToken) => {
            console.error("Error fetching admin data:", error);
            
            // Case 1: Network error
            if (!error.response) {
                console.error("Network error occurred. Check your connection.");
                setError("Network error. Please check your connection and try again.");
                setAdmin({ isLoading: false, adminEmail: null });
                return;
            }

            // Case 2: Token expired (401) with refresh token available
            if (error.response.status === 401 && refreshToken) {
                await handleTokenRefresh(token, refreshToken);
                return;
            }

            // Case 3: Unauthorized (401) without refresh token
            if (error.response.status === 401) {
                console.error("Unauthorized access. No refresh token available.");
                setError("Your session has expired. Please sign in again.");
                setShowModal(true);
                setAdmin({ isLoading: false, adminEmail: null });
                return;
            }

            // Case 4: Forbidden (403)
            if (error.response.status === 403) {
                console.error("Access forbidden. User may not have proper permissions.");
                setError("You don't have permission to access this resource.");
                setAdmin({ isLoading: false, adminEmail: null });
                return;
            }

            // Case 5: Server error (5xx)
            if (error.response.status >= 500) {
                console.error("Server error occurred:", error.response.status);
                setError("Server error. Please try again later.");
                setAdmin({ isLoading: false, adminEmail: null });
                return;
            }

            // Case 6: Other errors
            console.error("Unexpected error:", error.response?.status || error.message);
            setError(`Error: ${error.response?.data?.message || error.message}`);
            setAdmin({ isLoading: false, adminEmail: null });
        };

        // Handle token refresh process
        const handleTokenRefresh = async (originalToken, refreshToken) => {
            console.warn("Access token expired. Attempting to refresh token...");
            
            try {
                const refreshResponse = await axios.post(`${BASE_URL}/refresh-token`, { refreshToken });
                
                // Check if refresh response contains the expected data
                if (!refreshResponse.data || !refreshResponse.data.accessToken) {
                    throw new Error("Invalid refresh token response");
                }
                
                const newToken = refreshResponse.data.accessToken;
                localStorage.setItem("token", newToken);

                console.log("New access token obtained. Retrying admin data fetch...");
                
                try {
                    const retryResponse = await fetchAdminData(newToken);
                    handleSuccessfulResponse(retryResponse);
                } catch (retryError) {
                    console.error("Failed to fetch admin data after token refresh:", retryError);
                    setError("Failed to authenticate after token refresh. Please sign in again.");
                    setShowModal(true);
                    setAdmin({ isLoading: false, adminEmail: null });
                }
            } catch (refreshError) {
                console.error("Failed to refresh token:", refreshError.message);
                
                // Check for specific refresh token errors
                if (refreshError.response?.status === 400) {
                    console.error("Invalid refresh token format");
                    setError("Authentication error. Please sign in again.");
                } else if (refreshError.response?.status === 401) {
                    console.error("Refresh token expired or invalid");
                    setError("Your session has expired. Please sign in again.");
                } else {
                    console.error("Unexpected error during token refresh");
                    setError("Authentication error. Please try again later.");
                }
                
                // Clear invalid tokens
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                
                setShowModal(true);
                setAdmin({ isLoading: false, adminEmail: null });
            }
        };

        initAdmin();
    }, [location, setAdmin, setShowModal]);

    return (
        <>
            {showModal && <TokenExpiredModal />}
            {error && !showModal && (
                <div className="error-notification" style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    zIndex: 1000
                }}>
                    {error}
                </div>
            )}
        </>
    );
}

export default App;
