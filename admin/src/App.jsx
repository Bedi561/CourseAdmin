import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import axios from "axios";

import Signin from "./componentsAdmin/Signin.jsx";
import Signup from "./componentsAdmin/Signup.jsx";
import AddCourse from "./componentsAdmin/AddCourse.jsx";
import Courses from "./componentsAdmin/Courses";
import Course from "./componentsAdmin/Course";
import Admin from './componentsAdmin/Admin.jsx';
// import Students from './componentsAdmin/Students.jsx';
import Dash from './componentsAdmin/Dash.jsx';

import { adminState } from "./storeAdmin/atoms/admin.js";
import { BASE_URL } from "./config.js";

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

    useEffect(() => {
        const initAdmin = async () => {
            try {
                console.log("Initiating ADMIN data fetch...");
                const token = localStorage.getItem("token");
                if (!token) {
                    console.log("No token found. Aborting admin data initialization.");
                    setAdmin({ isLoading: false, adminEmail: null });
                    return;
                }

                setAdmin({ isLoading: true, adminEmail: null });

                const response = await axios.get(`${BASE_URL}/me`, {
                    headers: { "Authorization": "Bearer " + token }
                });

                console.log("Admin data response:", response.data);

                if (response.data.username) {
                    setAdmin({ isLoading: false, adminEmail: response.data.username });
                    console.log("Admin data initialized successfully.");
                } else {
                    setAdmin({ isLoading: false, adminEmail: null });
                    console.log("Admin data not found in response.");
                }
            } catch (error) {
                console.error("Error initializing admin data:", error);
                setAdmin({ isLoading: false, adminEmail: null });
            }
        };

        initAdmin();
    }, [location, setAdmin]);

    return null;
}

export default App;

