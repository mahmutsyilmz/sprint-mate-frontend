import { api } from './api';
import type { User, Role } from '../types';

export const userService = {
  /**
   * Gets the current authenticated user's profile.
   */
  getMe: () => api.get<User>('/users/me'),

  /**
   * Updates the current user's role (FRONTEND or BACKEND).
   * This is required before the user can be matched with a partner.
   */
  updateRole: (role: Role) =>
    api.patch<User>('/users/me/role', { roleName: role }),
};
