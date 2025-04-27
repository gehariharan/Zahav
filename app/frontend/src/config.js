/**
 * Application configuration
 * 
 * This file centralizes all configuration variables used throughout the application.
 * It reads from environment variables when available (set in .env files or deployment environment).
 */

// API Configuration
export const API_URL = process.env.REACT_APP_API_URL || 'https://shastha.online/api';

// Debug mode
export const DEBUG = process.env.NODE_ENV !== 'production';

// Log configuration values in development
if (DEBUG) {
  console.log('Configuration loaded:');
  console.log('- API_URL:', API_URL);
  console.log('- Environment:', process.env.NODE_ENV);
}

// Debug logging
console.log('Environment variables:', {
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  NODE_ENV: process.env.NODE_ENV
});

