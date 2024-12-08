import React from "react";
import Sidebar from "./Sidebar.jsx";
import Appbar from "./Appbar.jsx";
import { useRecoilValue } from "recoil";
import { isAdminLoading } from "../storeAdmin/selectors/isAdminLoading";
import { adminEmailState } from "../storeAdmin/selectors/adminEmail";

const Admin = ({ children }) => {
  const isLoading = useRecoilValue(isAdminLoading);
  const adminEmail = useRecoilValue(adminEmailState);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!adminEmail) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Appbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <h3 className="text-gray-700 text-3xl font-medium">Dashboard</h3>
            <div className="mt-4">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;

