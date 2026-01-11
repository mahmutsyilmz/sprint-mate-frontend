// Authentication Service
// Handles GitHub OAuth2 login flow

// Backend base URL - full page redirects don't go through Vite proxy
const BACKEND_URL = 'http://localhost:8080';

export const authService = {
  /**
   * Initiates GitHub OAuth2 login by redirecting to backend OAuth endpoint.
   * The backend handles the OAuth flow and redirects back with session cookie.
   */
  login: () => {
    window.location.href = `${BACKEND_URL}/oauth2/authorization/github`;
  },

  /**
   * Logs out the current user by calling backend logout endpoint.
   */
  logout: () => {
    window.location.href = `${BACKEND_URL}/logout`;
  },
};
