import axios from 'axios';
import { API_URL } from '../config';

/**
 * Check if the backend API is accessible
 * @returns {Promise<{isHealthy: boolean, message: string}>}
 */
export const checkApiHealth = async () => {
  try {
    const response = await axios.get(`${API_URL}/`);
    console.log('API health check response:', response.data);
    return {
      isHealthy: true,
      message: response.data.message || 'API is operational'
    };
  } catch (error) {
    console.error('API health check failed:', error);
    return {
      isHealthy: false,
      message: 'Cannot connect to the API server. Please ensure the backend is running.'
    };
  }
};
