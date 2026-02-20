import { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks';
import type { ChatMessage } from '../types';

interface ChatPanelProps {
  matchId: string;
  userId: string;
  partnerName: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Real-time chat panel component.
 * Displays chat messages and allows sending new messages.
 */
export function ChatPanel({ matchId, userId, partnerName, isOpen, onClose }: ChatPanelProps) {
  const { messages, isConnected, isLoading, error, sendMessage } = useChat(isOpen ? matchId : null);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = () => {
    const content = inputValue.trim();
    if (!content || !isConnected) return;

    sendMessage(content);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 w-full h-full sm:bottom-4 sm:right-4 sm:w-96 sm:h-[500px] bg-ide-panel border border-ide-border sm:rounded-lg shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-ide-border bg-ide-bg rounded-t-lg">
        <div className="flex items-center gap-2">
          <span className="text-lg">💬</span>
          <div>
            <span className="text-white font-bold text-sm">Team Chat</span>
            <span className="text-syntax-gray text-xs ml-2">with {partnerName}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Connection status indicator */}
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-primary' : 'bg-red-400 animate-pulse'
            }`} />
            <span className="text-[10px] text-syntax-gray">
              {isConnected ? 'Connected' : 'Reconnecting...'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-syntax-gray hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-syntax-gray">
            <span className="material-symbols-outlined animate-spin mr-2">sync</span>
            Loading messages...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-400">
            <span className="material-symbols-outlined mr-2">error</span>
            {error}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-syntax-gray">
            <span className="material-symbols-outlined text-[32px] mb-2">chat_bubble</span>
            <p className="text-sm">No messages yet</p>
            <p className="text-xs">Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === userId}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3 border-t border-ide-border">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isConnected ? "Type a message..." : "Connecting..."}
            disabled={!isConnected}
            className="flex-1 bg-ide-bg border border-ide-border rounded px-3 py-2 text-sm text-white placeholder-syntax-gray focus:outline-none focus:border-primary disabled:opacity-50"
            maxLength={2000}
          />
          <button
            onClick={handleSend}
            disabled={!isConnected || !inputValue.trim()}
            className="px-4 py-2 bg-primary text-black font-bold rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Individual message bubble component.
 */
function MessageBubble({ message, isOwn }: { message: ChatMessage; isOwn: boolean }) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${isOwn ? 'order-2' : 'order-1'}`}>
        {/* Sender name (only for partner's messages) */}
        {!isOwn && (
          <div className="text-[10px] text-syntax-blue mb-1 ml-2">
            {message.senderName}
          </div>
        )}

        {/* Message bubble */}
        <div className={`px-3 py-2 rounded-lg ${
          isOwn
            ? 'bg-primary/20 border border-primary/30 text-white'
            : 'bg-ide-bg border border-ide-border text-[#cccccc]'
        }`}>
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          <p className={`text-[10px] mt-1 ${isOwn ? 'text-primary/70' : 'text-syntax-gray'}`}>
            {formatTime(message.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
