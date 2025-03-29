/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { FaGraduationCap, FaUsers, FaChartLine, FaStar, FaBook, FaMoneyBillWave } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Appbar from "./Appbar";
import Sidebar from "./Sidebar";
import axios from 'axios';
import { BASE_URL } from "../config.js";

const Dashboard = () => {
  // State for storing fetched data
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalRevenue: 0,
    averageRating: 0
  });
  const [topCourses, setTopCourses] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [monthlyEnrollments, setMonthlyEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for initial render - will be replaced with API data
  // const mockData = {
  //   stats: {
  //     totalStudents: 15234,
  //     totalCourses: 87,
  //     totalRevenue: 1234567,
  //     averageRating: 4.7
  //   },
  //   topCourses: [
  //     { name: "Advanced Machine Learning", students: 1234, rating: 4.9 },
  //     { name: "Web Development Bootcamp", students: 987, rating: 4.8 },
  //     { name: "Data Science Fundamentals", students: 876, rating: 4.7 },
  //     { name: "Mobile App Development with React Native", students: 765, rating: 4.6 },
  //     { name: "Python for Beginners", students: 654, rating: 4.5 }
  //   ],
  //   monthlyRevenue: [
  //     { name: 'Jan', revenue: 65000 },
  //     { name: 'Feb', revenue: 59000 },
  //     { name: 'Mar', revenue: 80000 },
  //     { name: 'Apr', revenue: 81000 },
  //     { name: 'May', revenue: 56000 },
  //     { name: 'Jun', revenue: 55000 },
  //     { name: 'Jul', revenue: 40000 },
  //   ],
  //   recentEnrollments: [
  //     { id: 1, student: "Alice Johnson", course: "Advanced Machine Learning", date: "2023-07-15", courseId: "c1" },
  //     { id: 2, student: "Bob Smith", course: "Web Development Bootcamp", date: "2023-07-14", courseId: "c2" },
  //     { id: 3, student: "Charlie Brown", course: "Data Science Fundamentals", date: "2023-07-13", courseId: "c3" },
  //     { id: 4, student: "Diana Prince", course: "Mobile App Development with React Native", date: "2023-07-12", courseId: "c4" },
  //     { id: 5, student: "Ethan Hunt", course: "Python for Beginners", date: "2023-07-11", courseId: "c5" },
  //   ],
  //   monthlyEnrollments: [
  //     { name: 'Jan', enrollments: 125, revenue: 65000 },
  //     { name: 'Feb', enrollments: 110, revenue: 59000 },
  //     { name: 'Mar', enrollments: 150, revenue: 80000 },
  //     { name: 'Apr', enrollments: 152, revenue: 81000 },
  //     { name: 'May', enrollments: 102, revenue: 56000 },
  //     { name: 'Jun', enrollments: 105, revenue: 55000 },
  //     { name: 'Jul', enrollments: 80, revenue: 40000 },
  //   ]
  // };

  useEffect(() => {
    // Fetch dashboard data
    // const fetchDashboardData = async () => {
    //   try {
    //     setIsLoading(true);
        
    //     // Initialize with mock data
    //     // setStats(mockData.stats);
    //     // setTopCourses(mockData.topCourses);
    //     // setMonthlyRevenue(mockData.monthlyRevenue);
    //     // setRecentEnrollments(mockData.recentEnrollments);
    //     // setMonthlyEnrollments(mockData.monthlyEnrollments);
        
    //     try {
    //       // Fetch data from the API endpoints
    //       const dashboardStatsResponse = await axios.get(`${BASE_URL}/dashboard/stats`);
    //       if (dashboardStatsResponse.data && dashboardStatsResponse.data.stats) {
    //         setStats(dashboardStatsResponse.data.stats);
    //         setTopCourses(dashboardStatsResponse.data.topCourses || []);
    //         setMonthlyRevenue(dashboardStatsResponse.data.monthlyRevenue || []);
    //         setRecentEnrollments(dashboardStatsResponse.data.recentEnrollments || []);
    //       }
          

    //       const enrollmentStatsResponse = await axios.get(`${BASE_URL}/dashboard/enrollments/monthly`);
    //       if (enrollmentStatsResponse.data && enrollmentStatsResponse.data.monthlyData) {
    //         setMonthlyEnrollments(enrollmentStatsResponse.data.monthlyData);
    //       }
    //     } catch (apiError) {
    //       console.error("API Error:", apiError);
    //       // Continue with mock data, don't set error state
    //     }
        
    //     setIsLoading(false);
    //   } catch (err) {
    //     console.error("Error in component:", err);
    //     setError("Failed to initialize dashboard data.");
    //     setIsLoading(false);
    //   }
    // };

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        try {
          // Add the Authorization header with the JWT token
          const headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          };
          
          // Include headers in your requests
          const dashboardStatsResponse = await axios.get(`${BASE_URL}/dashboard/stats`, { headers });
          if (dashboardStatsResponse.data && dashboardStatsResponse.data.stats) {
            setStats(dashboardStatsResponse.data.stats);
            setTopCourses(dashboardStatsResponse.data.topCourses || []);
            setMonthlyRevenue(dashboardStatsResponse.data.monthlyRevenue || []);
            setRecentEnrollments(dashboardStatsResponse.data.recentEnrollments || []);
          }
          
          const enrollmentStatsResponse = await axios.get(`${BASE_URL}/dashboard/enrollments/monthly`, { headers });
          if (enrollmentStatsResponse.data && enrollmentStatsResponse.data.monthlyData) {
            setMonthlyEnrollments(enrollmentStatsResponse.data.monthlyData);
          }
        } catch (apiError) {
          console.error("API Error:", apiError);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error in component:", err);
        setError("Failed to initialize dashboard data.");
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCourseClick = async (courseId) => {
    try {
      const response = await axios.get(`${BASE_URL}/dashboard/course/${courseId}/stats`);
      console.log("Course stats:", response.data);
      // Here you could open a modal or navigate to a course details page
      // For now, we'll just log the data
    } catch (err) {
      console.error("Error fetching course stats:", err);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Safely access stats properties
  const totalStudents = stats?.totalStudents || 0;
  const totalCourses = stats?.totalCourses || 0;
  const totalRevenue = stats?.totalRevenue || 0;
  const averageRating = stats?.averageRating || 0;

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Appbar />
        <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
              <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow transition-all hover:shadow-md p-5">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                    <FaUsers className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Students</p>
                    <h4 className="text-2xl font-bold text-gray-800">{totalStudents.toLocaleString()}</h4>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow transition-all hover:shadow-md p-5">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <FaBook className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Courses</p>
                    <h4 className="text-2xl font-bold text-gray-800">{totalCourses}</h4>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow transition-all hover:shadow-md p-5">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <FaMoneyBillWave className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <h4 className="text-2xl font-bold text-gray-800">{formatCurrency(totalRevenue)}</h4>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow transition-all hover:shadow-md p-5">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                    <FaStar className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Average Rating</p>
                    <h4 className="text-2xl font-bold text-gray-800">
                      {averageRating.toFixed(1)} 
                      <span className="text-xs text-yellow-500">
                        {Array(Math.round(averageRating)).fill('★').join('')}
                      </span>
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Revenue Chart */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Revenue</h2>
                {monthlyRevenue.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={monthlyRevenue}
                      margin={{
                        top: 5, right: 20, left: 0, bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
                      <YAxis tickFormatter={(value) => `$${value/1000}k`} tick={{ fill: '#6B7280' }} />
                      <Tooltip 
                        formatter={(value) => [`${formatCurrency(value)}`, 'Revenue']}
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      />
                      <Bar dataKey="revenue" fill="#6366F1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">No revenue data available</p>
                  </div>
                )}
              </div>

              {/* Top Courses */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Courses</h2>
                {topCourses.length > 0 ? (
                  <div className="space-y-4">
                    {topCourses.map((course, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{course.name}</p>
                          <p className="text-xs text-gray-500">{course.students.toLocaleString()} students</p>
                        </div>
                        <div className="flex items-center px-2 py-1 bg-green-50 rounded-full">
                          <span className="text-xs font-semibold text-green-700">{course.rating.toFixed(1)}</span>
                          <span className="ml-1 text-xs text-yellow-500">★</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">No course data available</p>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                    View All Courses
                  </button>
                </div>
              </div>
            </div>

            {/* Monthly Enrollment Chart */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Enrollments</h2>
              {monthlyEnrollments.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={monthlyEnrollments}
                    margin={{
                      top: 5, right: 20, left: 20, bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
                    <YAxis yAxisId="left" orientation="left" tick={{ fill: '#6B7280' }} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `$${value/1000}k`} tick={{ fill: '#6B7280' }} />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'enrollments') return [value, 'Enrollments'];
                        return [`${formatCurrency(value)}`, 'Revenue'];
                      }}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="enrollments" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Enrollments" />
                    <Bar yAxisId="right" dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500">No enrollment data available</p>
                </div>
              )}
            </div>

            {/* Recent Enrollments */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Recent Enrollments</h2>
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                {recentEnrollments.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentEnrollments.map((enrollment) => (
                        <tr key={enrollment.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-xs font-medium text-indigo-600">
                                  {enrollment.student.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{enrollment.student}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{enrollment.course}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{formatDate(enrollment.date)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button 
                              className="text-indigo-600 hover:text-indigo-900 transition-colors"
                              onClick={() => handleCourseClick(enrollment.courseId)}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">No enrollment data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;