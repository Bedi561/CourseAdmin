import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTv, FaChalkboardTeacher, FaUsers, FaPlus, FaTimes } from "react-icons/fa";

const Sidebar = ({ isOpen, onClose }) => {
  const [activeButton, setActiveButton] = useState('dashboard');
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = menuItems.find(item => item.path === currentPath);
    if (currentItem) {
      setActiveButton(currentItem.name);
    }
  }, [location]);

  const handleClick = (buttonName) => {
    setActiveButton(buttonName);
    onClose();
  };

  const menuItems = [
    { name: 'dashboard', icon: FaTv, text: 'Dashboard', path: '/admin/dashboard' },
    { name: 'courseManagement', icon: FaChalkboardTeacher, text: 'Course Management', path: '/admin/courses' },
    { name: 'addCourse', icon: FaPlus, text: 'Add Courses', path: '/admin/addcourse' },
    { name: 'studentManagement', icon: FaUsers, text: 'Student Management', path: '/admin/student-management' },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <nav className="h-full flex flex-col py-6 px-4 space-y-4">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <FaTimes className="w-6 h-6" />
        </button>
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center p-3 rounded-lg transition-colors duration-200 ease-in-out ${
              activeButton === item.name
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => handleClick(item.name)}
          >
            <item.icon className="w-6 h-6 mr-3" />
            <span className="text-sm font-medium">{item.text}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

