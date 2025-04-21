import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { debounce } from '../utils/debounce';
import { API_URL } from '../config';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create an axios instance with authorization header using useMemo to prevent recreation on each render
  const authAxios = useMemo(() => {
    const instance = axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    return instance;
  }, [token]); // Only recreate when token changes

  // Create a debounced version of the auth check function
  const debouncedAuthCheck = useCallback(
    debounce(async (authAxiosInstance, isComponentMounted) => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authAxiosInstance.get('/users/me');
        if (isComponentMounted()) {
          setCurrentUser(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        // If token is invalid, remove it
        if (isComponentMounted()) {
          localStorage.removeItem('token');
          setToken(null);
          setCurrentUser(null);
          setLoading(false);
        }
      }
    }, 300), // 300ms debounce time
    [token]
  );

  // Check if user is authenticated on initial load
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount

    // Function to check if component is still mounted
    const isComponentMounted = () => isMounted;

    // Call the debounced auth check
    debouncedAuthCheck(authAxios, isComponentMounted);

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [token, debouncedAuthCheck, authAxios]);

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

      // We don't need to fetch user data here as the useEffect will handle it
      // when the token changes
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
      console.log('Registering user with data:', userData);
      console.log('API URL:', `${API_URL}/auth/register`);

      const response = await axios.post(`${API_URL}/auth/register`, userData);
      console.log('Registration response:', response.data);

      setError(null);
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);

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
