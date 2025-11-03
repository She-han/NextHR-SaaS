import axios from 'axios';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data; // Return only data from API response
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear auth and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      if (status === 403) {
        // Forbidden - show error
        console.error('Access denied');
      }
      
      // Return error message from API or default message
      return Promise.reject(data?.message || 'An error occurred');
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request
      return Promise.reject(error.message);
    }
  }
);

export default axiosInstance;
