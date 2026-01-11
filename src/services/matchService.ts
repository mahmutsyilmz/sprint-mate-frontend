import { api } from './api';
import type { MatchStatus, MatchCompletion } from '../types';

export const matchService = {
  /**
   * Initiates the matching process or joins the waiting queue.
   * Returns MATCHED status with details, or WAITING status with queue position.
   */
  findMatch: async (): Promise<MatchStatus> => {
    const response = await api.post<MatchStatus>('/matches/find');
    return response.data;
  },

  /**
   * Cancels waiting in the queue.
   */
  cancelWaiting: async (): Promise<void> => {
    await api.delete('/matches/queue');
  },

  /**
   * Completes an active match with optional repository URL.
   */
  completeMatch: async (matchId: string, repositoryUrl?: string): Promise<MatchCompletion> => {
    const response = await api.post<MatchCompletion>(
      `/matches/${matchId}/complete`,
      repositoryUrl ? { repositoryUrl } : undefined
    );
    return response.data;
  },
};
