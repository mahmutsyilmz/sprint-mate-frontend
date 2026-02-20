import { api } from './api';
import type { ProjectTheme } from '../types';

export const themeService = {
  /**
   * Gets all active project themes.
   * Used to populate the theme selector in profile editing.
   */
  getAll: async (): Promise<ProjectTheme[]> => {
    const response = await api.get<ProjectTheme[]>('/projects/themes');
    return response.data;
  },
};
