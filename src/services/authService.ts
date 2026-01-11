// Authentication Service
// Handles GitHub OAuth2 login flow

import { api } from './api';

// Backend base URL - full page redirects don't go through Vite proxy
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

export const authService = {
  /**
   * Initiates GitHub OAuth2 login by redirecting to backend OAuth endpoint.
   * The backend handles the OAuth flow and redirects back with session cookie.
   * 
   * IMPORTANT: This is a full page redirect, NOT an axios call.
   * The browser navigates to the backend OAuth endpoint.
   */
  login: () => {
    window.location.href = `${BACKEND_URL}/oauth2/authorization/github`;
  },

  /**
   * Logs out the current user by calling the backend logout API.
   * This invalidates the session and clears the JSESSIONID cookie.
   * Returns a promise so we can handle post-logout actions.
   */
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};
