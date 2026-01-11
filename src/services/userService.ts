import { api } from './api';
import type { User, Role, UserUpdateRequest } from '../types';

export const userService = {
  /**
   * Gets the current authenticated user's profile.
   */
  getMe: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  /**
   * Updates the current user's role (FRONTEND or BACKEND).
   * This is required before the user can be matched with a partner.
   */
  updateRole: async (role: Role): Promise<User> => {
    const response = await api.patch<User>('/users/me/role', { roleName: role });
    return response.data;
  },

  /**
   * Updates the current user's profile (name, bio, skills, optionally role).
   * Skills are used for AI-powered project matching.
   */
  updateProfile: async (data: UserUpdateRequest): Promise<User> => {
    const response = await api.put<User>('/users/me', data);
    return response.data;
  },
};
