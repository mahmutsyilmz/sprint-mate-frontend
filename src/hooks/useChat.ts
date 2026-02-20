import { useState, useEffect, useCallback, useRef } from 'react';
import { Client, type IMessage } from '@stomp/stompjs';
import { chatService } from '../services';
import { logger } from '../utils/logger';
import type { ChatMessage, ChatMessageRequest } from '../types';

// Use native WebSocket URL (ws:// instead of http://)
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';
const RECONNECT_DELAY_BASE = 1000;
const MAX_RECONNECT_DELAY = 30000;

interface UseChatReturn {
  messages: ChatMessage[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => void;
}

/**
 * Hook for managing real-time chat functionality.
 * Handles WebSocket connection, message history, and sending messages.
 *
 * @param matchId The match ID to connect to
 */
export function useChat(matchId: string | null): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clientRef = useRef<Client | null>(null);
  const reconnectAttemptRef = useRef(0);
  const messageIdsRef = useRef<Set<string>>(new Set());

  // Load chat history
  const loadHistory = useCallback(async () => {
    if (!matchId) return;

    setIsLoading(true);
    setError(null);

    try {
      const history = await chatService.getChatHistory(matchId);
      // Track message IDs to prevent duplicates
      history.forEach(msg => messageIdsRef.current.add(msg.id));
      setMessages(history);
    } catch (err) {
      logger.error('Failed to load chat history:', err);
      setError('Failed to load chat history');
    } finally {
      setIsLoading(false);
    }
  }, [matchId]);

  // Add a message to state (with deduplication)
  const addMessage = useCallback((message: ChatMessage) => {
    if (messageIdsRef.current.has(message.id)) {
      return; // Skip duplicate
    }
    messageIdsRef.current.add(message.id);
    setMessages(prev => [...prev, message]);
  }, []);

  // Send a message via WebSocket
  const sendMessage = useCallback((content: string) => {
    if (!clientRef.current?.connected || !matchId) {
      logger.warn('Cannot send message: not connected');
      return;
    }

    const request: ChatMessageRequest = {
      matchId,
      content
    };

    clientRef.current.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(request)
    });
  }, [matchId]);

  // Setup WebSocket connection
  useEffect(() => {
    if (!matchId) {
      setIsLoading(false);
      return;
    }

    // Load history first
    loadHistory();

    // Setup STOMP client with native WebSocket
    const client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: RECONNECT_DELAY_BASE,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      onConnect: () => {
        logger.debug('WebSocket connected');
        setIsConnected(true);
        setError(null);
        reconnectAttemptRef.current = 0;

        // Subscribe to match topic
        client.subscribe(`/topic/match/${matchId}`, (message: IMessage) => {
          try {
            const chatMessage: ChatMessage = JSON.parse(message.body);
            addMessage(chatMessage);
          } catch (err) {
            logger.error('Failed to parse message:', err);
          }
        });
      },

      onDisconnect: () => {
        logger.debug('WebSocket disconnected');
        setIsConnected(false);
      },

      onStompError: (frame) => {
        logger.error('STOMP error:', frame.headers['message']);
        setError('Connection error. Retrying...');
      },

      onWebSocketError: (event) => {
        logger.error('WebSocket error:', event);
        setError('Connection error. Retrying...');
      },

      onWebSocketClose: () => {
        setIsConnected(false);
        // Exponential backoff for reconnection
        reconnectAttemptRef.current++;
        const delay = Math.min(
          RECONNECT_DELAY_BASE * Math.pow(2, reconnectAttemptRef.current),
          MAX_RECONNECT_DELAY
        );
        logger.debug(`Reconnecting in ${delay}ms (attempt ${reconnectAttemptRef.current})`);
      }
    });

    clientRef.current = client;
    const currentMessageIds = messageIdsRef.current;
    client.activate();

    // Cleanup on unmount or matchId change
    return () => {
      if (client.connected) {
        client.deactivate();
      }
      clientRef.current = null;
      currentMessageIds.clear();
    };
  }, [matchId, loadHistory, addMessage]);

  return {
    messages,
    isConnected,
    isLoading,
    error,
    sendMessage
  };
}
