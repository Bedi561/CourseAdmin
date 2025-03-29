/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Appbar from "./Appbar.jsx";
import { useRecoilValue } from "recoil";
import { isAdminLoading } from "../storeAdmin/selectors/isAdminLoading";
import { adminEmailState } from "../storeAdmin/selectors/adminEmail";

const Admin = ({ children }) => {
  const isLoading = useRecoilValue(isAdminLoading);
  const adminEmail = useRecoilValue(adminEmailState);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Effect to handle authentication redirects
  useEffect(() => {
    if (!isLoading && !adminEmail && retryCount >= maxRetries) {
      // Redirect to login after max retries
      navigate("/admin/signin", { 
        state: { 
          message: "Your session has expired. Please sign in again.",
          returnPath: window.location.pathname
        }
      });
    }
  }, [isLoading, adminEmail, retryCount, navigate]);

  // Effect to handle retry attempts when admin email is not loaded
  useEffect(() => {
    let retryTimer;
    
    if (!isLoading && !adminEmail && retryCount < maxRetries) {
      setError(`Verifying authentication (attempt ${retryCount + 1}/${maxRetries})...`);
      
      retryTimer = setTimeout(() => {
        // This would typically trigger a revalidation of admin state
        // For this example, we're just incrementing the retry counter
        setRetryCount(prev => prev + 1);
      }, 2000); // Retry every 2 seconds
    }
    
    return () => {
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [isLoading, adminEmail, retryCount]);

  // Reset error states if admin is successfully loaded
  useEffect(() => {
    if (adminEmail) {
      setError(null);
      setRetryCount(0);
    }
  }, [adminEmail]);

  // Handle browser network status
  useEffect(() => {
    const handleOnline = () => {
      if (!adminEmail && retryCount > 0) {
        setError("Connection restored. Verifying authentication...");
        setRetryCount(0); // Reset retry count to try again
      }
    };

    const handleOffline = () => {
      setError("Network connection lost. Please check your internet connection.");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [adminEmail, retryCount]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
      </div>
    );
  }

  // Error state with retry option
  if (!adminEmail) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please log in to access the admin dashboard.</p>
          {error && (
            <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
              <p>{error}</p>
            </div>
          )}
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => navigate("/admin/signin", { state: { returnPath: window.location.pathname } })}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
            >
              Sign In
            </button>
            <button
              onClick={() => setRetryCount(0)}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-200"
              disabled={retryCount < maxRetries ? false : true}
            >
              Retry Authentication
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main admin dashboard content
  return (
    <div className="flex h-screen bg-gray-100">
      <ErrorBoundary fallback={<ErrorFallback onReset={() => window.location.reload()} />}>
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
      </ErrorBoundary>
    </div>
  );
};

// Error boundary component to catch rendering errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Dashboard error:", error, errorInfo);
    // Here you could log errors to your monitoring service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Component displayed when an unhandled error occurs
const ErrorFallback = ({ onReset }) => (
  <div className="flex items-center justify-center h-screen bg-gray-100">
    <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Something went wrong</h1>
      <p className="text-gray-600 mb-6">
        We encountered an unexpected error while loading the dashboard.
      </p>
      <button
        onClick={onReset}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default Admin;