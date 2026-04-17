// frontend/src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
      API.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`; // auto-add token
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async ({ email, password }) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      setUser(data.user);
      setToken(data.token);

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      // Set default Authorization header for future requests
      API.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      return data.user;
    } catch (err) {
      console.error('Login error:', err);
      throw err; // <-- throw error so LoginPage can catch it
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete API.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);