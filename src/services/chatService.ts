import { api } from './api';
import type { ChatMessage } from '../types';

/**
 * Chat API service for REST operations.
 * WebSocket messaging is handled separately in useChat hook.
 */
export const chatService = {
  /**
   * Retrieves chat history for a match conversation.
   *
   * @param matchId The match ID to retrieve history for
   * @param limit Maximum number of messages to retrieve (default 100)
   * @returns List of chat messages ordered chronologically
   */
  async getChatHistory(matchId: string, limit: number = 100): Promise<ChatMessage[]> {
    const response = await api.get<ChatMessage[]>(`/chat/history/${matchId}`, {
      params: { limit }
    });
    return response.data;
  }
};
