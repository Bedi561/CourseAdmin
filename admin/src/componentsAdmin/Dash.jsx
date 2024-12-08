import React, { useState } from "react";
import { FaGraduationCap, FaUsers, FaChartLine, FaStar, FaBook, FaMoneyBillWave, FaBars } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Appbar from "./Appbar";
import Sidebar from "./Sidebar";

const Dashboard = () => {
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock data (this would typically come from your backend)
  const stats = {
    totalStudents: 15234,
    totalCourses: 87,
    totalRevenue: 1234567,
    averageRating: 4.7
  };

  const topCourses = [
    { name: "Advanced Machine Learning", students: 1234, rating: 4.9 },
    { name: "Web Development Bootcamp", students: 987, rating: 4.8 },
    { name: "Data Science Fundamentals", students: 876, rating: 4.7 },
    { name: "Mobile App Development with React Native", students: 765, rating: 4.6 },
    { name: "Python for Beginners", students: 654, rating: 4.5 }
  ];

  const monthlyRevenue = [
    { name: 'Jan', revenue: 65000 },
    { name: 'Feb', revenue: 59000 },
    { name: 'Mar', revenue: 80000 },
    { name: 'Apr', revenue: 81000 },
    { name: 'May', revenue: 56000 },
    { name: 'Jun', revenue: 55000 },
    { name: 'Jul', revenue: 40000 },
  ];

  const recentEnrollments = [
    { id: 1, student: "Alice Johnson", course: "Advanced Machine Learning", date: "2023-07-15" },
    { id: 2, student: "Bob Smith", course: "Web Development Bootcamp", date: "2023-07-14" },
    { id: 3, student: "Charlie Brown", course: "Data Science Fundamentals", date: "2023-07-13" },
    { id: 4, student: "Diana Prince", course: "Mobile App Development with React Native", date: "2023-07-12" },
    { id: 5, student: "Ethan Hunt", course: "Python for Beginners", date: "2023-07-11" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} /> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Appbar />
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            {/* <button
              className="text-gray-500 hover:text-gray-600 mb-4"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FaBars className="h-6 w-6" />
            </button> */}
            <h3 className="text-gray-700 text-3xl font-medium">Dashboard</h3>

            {/* Stats */}
            <div className="mt-4">
              <div className="flex flex-wrap -mx-6">
                <div className="w-full px-6 sm:w-1/2 xl:w-1/4">
                  <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
                    <div className="p-3 rounded-full bg-indigo-600 bg-opacity-75">
                      <FaUsers className="h-8 w-8 text-white" />
                    </div>
                    <div className="mx-5">
                      <h4 className="text-2xl font-semibold text-gray-700">{stats.totalStudents.toLocaleString()}</h4>
                      <div className="text-gray-500">Total Students</div>
                    </div>
                  </div>
                </div>
                <div className="w-full mt-6 px-6 sm:w-1/2 xl:w-1/4 sm:mt-0">
                  <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
                    <div className="p-3 rounded-full bg-orange-600 bg-opacity-75">
                      <FaBook className="h-8 w-8 text-white" />
                    </div>
                    <div className="mx-5">
                      <h4 className="text-2xl font-semibold text-gray-700">{stats.totalCourses}</h4>
                      <div className="text-gray-500">Total Courses</div>
                    </div>
                  </div>
                </div>
                <div className="w-full mt-6 px-6 sm:w-1/2 xl:w-1/4 xl:mt-0">
                  <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
                    <div className="p-3 rounded-full bg-pink-600 bg-opacity-75">
                      <FaMoneyBillWave className="h-8 w-8 text-white" />
                    </div>
                    <div className="mx-5">
                      <h4 className="text-2xl font-semibold text-gray-700">${stats.totalRevenue.toLocaleString()}</h4>
                      <div className="text-gray-500">Total Revenue</div>
                    </div>
                  </div>
                </div>
                <div className="w-full mt-6 px-6 sm:w-1/2 xl:w-1/4 xl:mt-0">
                  <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
                    <div className="p-3 rounded-full bg-green-600 bg-opacity-75">
                      <FaStar className="h-8 w-8 text-white" />
                    </div>
                    <div className="mx-5">
                      <h4 className="text-2xl font-semibold text-gray-700">{stats.averageRating}</h4>
                      <div className="text-gray-500">Average Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="mt-8">
              <div className="flex flex-col mt-8">
                <div className="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                  <div className="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
                    <h2 className="text-2xl font-semibold text-gray-700 px-6 py-4">Monthly Revenue</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={monthlyRevenue}
                        margin={{
                          top: 5, right: 30, left: 20, bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Courses */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-700">Top Courses</h2>
              <div className="mt-4">
                <div className="flex flex-col mt-8">
                  <div className="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <div className="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
                      <table className="min-w-full">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">Course Name</th>
                            <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">Students</th>
                            <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">Rating</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {topCourses.map((course, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <div className="flex items-center">
                                  <div className="ml-4">
                                    <div className="text-sm leading-5 font-medium text-gray-900">{course.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <div className="text-sm leading-5 text-gray-900">{course.students}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {course.rating}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Enrollments */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-700">Recent Enrollments</h2>
              <div className="mt-4">
                <div className="flex flex-col mt-8">
                  <div className="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <div className="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
                      <table className="min-w-full">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">Student</th>
                            <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">Course</th>
                            <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">Date</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {recentEnrollments.map((enrollment) => (
                            <tr key={enrollment.id}>
                              <td className="px-6 py-4whitespace-no-wrap border-b border-gray-200">
                                <div className="flex items-center">
                                  <div className="ml-4">
                                    <div className="text-sm leading-5 font-medium text-gray-900">{enrollment.student}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <div className="text-sm leading-5 text-gray-900">{enrollment.course}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <div className="text-sm leading-5 text-gray-500">{enrollment.date}</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

