import axios from 'axios';

// Create axios instance with credentials support for session cookies
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  withCredentials: true, // Required for JSESSIONID cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - session expired or not authenticated
    if (error.response?.status === 401) {
      // Let the calling code handle 401 errors
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export { api };
