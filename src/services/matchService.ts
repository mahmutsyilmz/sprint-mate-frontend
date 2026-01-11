import { api } from './api';
import type { MatchStatus, MatchCompletion } from '../types';

export const matchService = {
  /**
   * Initiates the matching process or joins the waiting queue.
   * Returns MATCHED status with details, or WAITING status with queue position.
   */
  findMatch: () => api.post<MatchStatus>('/matches/find'),

  /**
   * Cancels waiting in the queue.
   */
  cancelWaiting: () => api.delete<void>('/matches/queue'),

  /**
   * Completes an active match with optional repository URL.
   */
  completeMatch: (matchId: string, repositoryUrl?: string) =>
    api.post<MatchCompletion>(`/matches/${matchId}/complete`, 
      repositoryUrl ? { repositoryUrl } : undefined
    ),
};
