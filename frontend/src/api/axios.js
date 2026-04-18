// frontend/src/api/axios.js
import axios from 'axios';

// Create an Axios instance with base URL
const instance = axios.create({
// Uses REACT_APP_API_URL from .env or .env.production
baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});
// Interceptor: adds token to every request if present
instance.interceptors.request.use((config) => {
const token = localStorage.getItem('token');
if (token) config.headers.Authorization = `Bearer ${token}`;
return config;
});
export default instance;