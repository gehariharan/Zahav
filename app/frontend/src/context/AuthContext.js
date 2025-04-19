import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// API base URL
const API_URL = 'http://localhost:8000';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create an axios instance with authorization header
  const authAxios = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  // Update axios instance when token changes
  useEffect(() => {
    authAxios.defaults.headers.Authorization = token ? `Bearer ${token}` : '';
  }, [token, authAxios]);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authAxios.get('/users/me');
        setCurrentUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Authentication check failed:', error);
        // If token is invalid, remove it
        localStorage.removeItem('token');
        setToken(null);
        setCurrentUser(null);
        setLoading(false);
      }
    };

    checkAuth();
  }, [token, authAxios]);

  // Login function
  const login = async (username, password) => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post(`${API_URL}/auth/token`, formData);
      const { access_token } = response.data;

      // Save token to local storage
      localStorage.setItem('token', access_token);
      setToken(access_token);

      // Get user data
      const userResponse = await authAxios.get('/users/me');
      setCurrentUser(userResponse.data);
      setError(null);

      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.detail || 'Login failed. Please try again.');
      return { success: false, error: error.response?.data?.detail || 'Login failed' };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      await axios.post(`${API_URL}/auth/register`, userData);
      setError(null);
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.response?.data?.detail || 'Registration failed. Please try again.');
      return { success: false, error: error.response?.data?.detail || 'Registration failed' };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
  };

  // Update profile function
  const updateProfile = async (userData) => {
    try {
      const response = await authAxios.put('/users/me', userData);
      setCurrentUser(response.data);
      setError(null);
      return { success: true };
    } catch (error) {
      console.error('Profile update failed:', error);
      setError(error.response?.data?.detail || 'Profile update failed. Please try again.');
      return { success: false, error: error.response?.data?.detail || 'Profile update failed' };
    }
  };

  // Context value
  const value = {
    currentUser,
    isAuthenticated: !!token,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    authAxios,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
