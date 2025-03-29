/* eslint-disable no-unused-vars */
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from './config';
import { useState } from 'react';
import TokenExpiredModal from './componentsAdmin/TokenExpiryModal';

const useApiClient = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // State for controlling modal visibility

  const apiClient = axios.create({
    baseURL: BASE_URL,
  });

  // Function to refresh the token
  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken'); // Assume refresh token is stored in localStorage
      const response = await axios.post(`${BASE_URL}/refresh-token`, { refreshToken });
      const newToken = response.data.token;

      // Save the new access token
      localStorage.setItem('authToken', newToken);
      return newToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      // If refreshing fails, logout user and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      navigate('/login');
      return null; // Return null to indicate failure
    }
  };

  // Interceptor for handling token expiration
  apiClient.interceptors.response.use(
    (response) => response, // If the response is successful, return it
    async (error) => {
      if (error.response && error.response.status === 401) {
        // If token expired or user is unauthorized
        console.warn('Session expired. Trying to refresh the token...');

        // Try refreshing the token
        const newToken = await refreshToken();

        if (newToken) {
          // Retry the original request with the new token
          const originalRequest = error.config;
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return axios(originalRequest); // Retry the original request
        }

        // If refresh failed, show modal and redirect to login
        setShowModal(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000); // Delay before redirecting
      }

      return Promise.reject(error); // Return the error for further handling
    }
  );

  // Function to perform GET requests with error handling
  const get = async (url, config = {}) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await apiClient.get(url, {
        ...config,
        headers: { Authorization: `Bearer ${token}`, ...config.headers },
      });
      return response.data;
    } catch (error) {
      console.error('Error in GET request:', error);
      throw error;  // Propagate error
    }
  };

  // Function to perform POST requests with error handling
  const post = async (url, data, config = {}) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await apiClient.post(url, data, {
        ...config,
        headers: { Authorization: `Bearer ${token}`, ...config.headers },
      });
      return response.data;
    } catch (error) {
      console.error('Error in POST request:', error);
      throw error;  // Propagate error
    }
  };

  return { get, post, showModal, setShowModal };
};

export default useApiClient;
