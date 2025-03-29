import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChalkboardTeacher, FaPlus, FaTimes } from "react-icons/fa";
import { MdSpaceDashboard, MdOutlineSchool } from "react-icons/md";

const Sidebar = ({ isOpen, onClose }) => {
  const [activeButton, setActiveButton] = useState('dashboard');
  const location = useLocation();

  // Track active menu item based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Define menu items paths
    const menuItemPaths = [
      { name: 'dashboard', path: '/admin/dashboard' },
      { name: 'courseManagement', path: '/admin/courses' },
      { name: 'addCourse', path: '/admin/addcourse' },
      { name: 'studentManagement', path: '/admin/student-management' },
    ];
    
    // Find exact match first
    const exactMatch = menuItemPaths.find(item => item.path === currentPath);
    if (exactMatch) {
      setActiveButton(exactMatch.name);
      return;
    }
    
    // Try partial match for nested routes
    const partialMatch = menuItemPaths.find(item => 
      currentPath.startsWith(item.path) && item.path !== '/admin/dashboard'
    );
    if (partialMatch) {
      setActiveButton(partialMatch.name);
    } else if (currentPath.startsWith('/admin')) {
      // Default to dashboard for any admin route not matching others
      setActiveButton('dashboard');
    }
  }, [location.pathname]);

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  const handleClick = (buttonName) => {
    setActiveButton(buttonName);
    // Close sidebar when navigating
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const menuItems = [
    { 
      name: 'dashboard', 
      icon: MdSpaceDashboard, 
      text: 'Dashboard', 
      path: '/admin/dashboard',
      description: 'Overview and analytics' 
    },
    { 
      name: 'courseManagement', 
      icon: FaChalkboardTeacher, 
      text: 'Courses', 
      path: '/admin/courses',
      description: 'Manage your courses' 
    },
    { 
      name: 'addCourse', 
      icon: FaPlus, 
      text: 'Add Course', 
      path: '/admin/addcourse',
      description: 'Create new courses' 
    },
    { 
      name: 'studentManagement', 
      icon: MdOutlineSchool, 
      text: 'Students', 
      path: '/admin/student-management',
      description: 'Student enrollment data' 
    },
  ];

  return (
    <>
      {/* Overlay to close sidebar when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 transition-opacity duration-300"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Sidebar navigation"
      >
        {/* Header with logo and close button */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <img 
                src="/logo-small.png" 
                alt="Logo" 
                className="h-8 w-8"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='%234F46E5'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/%3E%3C/svg%3E";
                }}
              />
              <span className="ml-2 text-lg font-semibold text-gray-800">Admin Portal</span>
            </div>
          </div>
          
          {/* Close button */}
          <button
            type="button"
            className="flex items-center justify-center h-10 w-10 rounded-md text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto pt-5 pb-4 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center px-2 py-3 rounded-lg transition-all duration-200 ${
                  activeButton === item.name
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
                onClick={() => handleClick(item.name)}
                aria-current={activeButton === item.name ? 'page' : undefined}
              >
                <div className={`mr-3 flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-md ${
                  activeButton === item.name ? 'bg-blue-100 text-blue-600' : 'text-gray-500 group-hover:text-blue-500'
                }`}>
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{item.text}</span>
                  <span className="text-xs text-gray-500">{item.description}</span>
                </div>
                
                {/* Active indicator */}
                {activeButton === item.name && (
                  <span
                    className="absolute right-0 inset-y-0 w-1 bg-blue-600 rounded-l-md"
                    aria-hidden="true"
                  />
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer section */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>Need help?</p>
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
              View documentation
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;