/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';

const TokenExpiredModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null; // Don't render the modal if it's not open

  const handleLoginRedirect = () => {
    navigate('/login');
    onClose(); // Close the modal after redirect
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg text-center shadow-lg max-w-sm mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Session Expired</h2>
        <p className="text-gray-600 mb-4">Your session has expired. Please log in again.</p>
        <button
          onClick={handleLoginRedirect}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 focus:outline-none"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default TokenExpiredModal;
