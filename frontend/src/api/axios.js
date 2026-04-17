// frontend/src/api/axios.js
import axios from 'axios';

// Create an Axios instance with base URL
const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend API
});

// Interceptor: adds token to every request if present
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // get JWT from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // attach token
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;