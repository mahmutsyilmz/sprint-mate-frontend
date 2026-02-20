import { useEffect, useRef, useState } from 'react';

export interface TerminalLog {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface TerminalPanelProps {
  logs: TerminalLog[];
  isPolling?: boolean;
}

/**
 * Dynamic terminal panel with typewriter effect.
 * Displays logs character-by-character like a real terminal.
 */
export function TerminalPanel({ logs, isPolling = false }: TerminalPanelProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [displayedLogs, setDisplayedLogs] = useState<Map<string, string>>(new Map());
  const [typingLogId, setTypingLogId] = useState<string | null>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs, displayedLogs]);

  // Typewriter effect for new logs
  useEffect(() => {
    if (logs.length === 0) return;

    const lastLog = logs[logs.length - 1];
    const currentDisplayed = displayedLogs.get(lastLog.id);

    // Skip if this log is already fully displayed
    if (currentDisplayed === lastLog.message) return;

    // If there's no entry for this log, start typing it
    if (currentDisplayed === undefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- animation requires synchronous state seeding
      setTypingLogId(lastLog.id);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- animation requires synchronous state seeding
      setDisplayedLogs(prev => new Map(prev).set(lastLog.id, ''));
    }
  }, [logs, displayedLogs]);

  // Character-by-character typing animation
  useEffect(() => {
    if (!typingLogId) return;

    const log = logs.find(l => l.id === typingLogId);
    if (!log) return;

    const currentText = displayedLogs.get(typingLogId) || '';
    const targetText = log.message;

    if (currentText.length < targetText.length) {
      const timeout = setTimeout(() => {
        setDisplayedLogs(prev => {
          const newMap = new Map(prev);
          // Type 2-3 characters at a time for faster but still visible effect
          const charsToAdd = Math.min(3, targetText.length - currentText.length);
          newMap.set(typingLogId, targetText.slice(0, currentText.length + charsToAdd));
          return newMap;
        });
      }, 20); // Fast but visible typing speed

      return () => clearTimeout(timeout);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- animation completion
      setTypingLogId(null);
    }
  }, [typingLogId, displayedLogs, logs]);

  // Initialize all existing logs as fully displayed
  useEffect(() => {
    const initialLogs = new Map<string, string>();
    logs.slice(0, -1).forEach(log => {
      initialLogs.set(log.id, log.message);
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initialize existing logs on mount
    setDisplayedLogs(prev => {
      const merged = new Map(initialLogs);
      prev.forEach((value, key) => {
        merged.set(key, value);
      });
      return merged;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLogColor = (type: TerminalLog['type']) => {
    switch (type) {
      case 'success':
        return 'text-primary'; // Green
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'info':
      default:
        return 'text-syntax-blue'; // Blue for info
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="h-48 bg-ide-bg border-t border-ide-border flex flex-col">
      {/* Terminal header */}
      <div className="h-8 px-4 flex items-center justify-between text-[11px] border-b border-ide-border shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-white flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">terminal</span>
            Terminal
          </span>
          <span className="text-[#858585] cursor-default">Problems</span>
          <span className="text-[#858585] cursor-default">Output</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[14px] text-[#858585] cursor-default">add</span>
          <span className="material-symbols-outlined text-[14px] text-[#858585] cursor-default">splitscreen</span>
          <span className="material-symbols-outlined text-[14px] text-[#858585] cursor-default">close</span>
        </div>
      </div>

      {/* Terminal content */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-auto p-3 font-mono text-xs"
      >
        {logs.map((log) => {
          const displayedText = displayedLogs.get(log.id) ?? log.message;
          const isTyping = typingLogId === log.id && displayedText.length < log.message.length;
          
          return (
            <div 
              key={log.id} 
              className={`leading-relaxed ${getLogColor(log.type)}`}
            >
              <span className="text-syntax-gray mr-2">
                [{formatTimestamp(log.timestamp)}]
              </span>
              <span>{displayedText}</span>
              {isTyping && <span className="text-primary animate-cursor">▌</span>}
            </div>
          );
        })}
        
        {/* Polling indicator */}
        {isPolling && (
          <div className="text-yellow-400 flex items-center gap-1">
            <span className="text-syntax-gray mr-2">
              [{formatTimestamp(new Date())}]
            </span>
            <span className="material-symbols-outlined text-[12px] animate-spin">sync</span>
            <span>Polling for match updates...</span>
          </div>
        )}

        {/* Empty state */}
        {logs.length === 0 && !isPolling && (
          <div className="text-syntax-gray">
            <span className="text-primary">&gt;</span> Terminal ready. Awaiting commands...
            <span className="text-primary animate-cursor">_</span>
          </div>
        )}
      </div>
    </div>
  );
}
