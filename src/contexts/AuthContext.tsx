import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { userService } from '../services/userService';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<User | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Loading spinner styled as a compilation progress bar.
 * VS Code-inspired aesthetic.
 */
export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing...');

  useEffect(() => {
    const messages = [
      'Connecting to server...',
      'Authenticating session...',
      'Loading user profile...',
      'Compiling workspace...',
    ];
    
    let messageIndex = 0;
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 15 + 5;
        return next > 95 ? 95 : next;
      });
      
      if (messageIndex < messages.length) {
        setStatusText(messages[messageIndex]);
        messageIndex++;
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-ide-bg flex flex-col items-center justify-center font-mono">
      {/* IDE-style loading card */}
      <div className="w-full max-w-md bg-ide-panel border border-ide-border rounded-lg overflow-hidden shadow-2xl">
        {/* Tab bar */}
        <div className="h-8 bg-ide-bg border-b border-ide-border flex items-center px-3 gap-2">
          <span className="material-symbols-outlined text-[14px] text-primary animate-spin">sync</span>
          <span className="text-[#cccccc] text-xs">compiling...</span>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-[32px] text-primary">terminal</span>
            <div>
              <h1 className="text-white text-lg font-bold">Sprint Mate</h1>
              <p className="text-syntax-gray text-xs">Initializing development environment</p>
            </div>
          </div>

          {/* Progress bar container */}
          <div className="mb-4">
            <div className="h-2 bg-ide-bg rounded-full overflow-hidden border border-ide-border">
              <div 
                className="h-full bg-gradient-to-r from-primary via-ide-blue to-primary transition-all duration-300 ease-out"
                style={{ 
                  width: `${progress}%`,
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite linear'
                }}
              />
            </div>
          </div>

          {/* Status text */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-syntax-gray">&gt;</span>
            <span className="text-primary">{statusText}</span>
            <span className="text-primary animate-cursor">_</span>
          </div>

          {/* Decorative code snippet */}
          <div className="mt-6 bg-ide-bg rounded p-3 border border-ide-border opacity-60">
            <div className="text-[10px] text-syntax-gray leading-relaxed">
              <span className="text-syntax-purple">async</span>{' '}
              <span className="text-syntax-purple">function</span>{' '}
              <span className="text-syntax-yellow">initialize</span>() {'{'}
              <br />
              {'  '}<span className="text-syntax-purple">const</span>{' '}
              <span className="text-syntax-blue">session</span> ={' '}
              <span className="text-syntax-purple">await</span>{' '}
              <span className="text-syntax-yellow">authenticate</span>();
              <br />
              {'  '}<span className="text-syntax-purple">return</span>{' '}
              <span className="text-syntax-blue">session</span>.
              <span className="text-syntax-yellow">validate</span>();
              <br />
              {'}'}
            </div>
          </div>
        </div>
      </div>

      {/* Shimmer animation style */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async (): Promise<User | null> => {
    try {
      const userData = await userService.getMe();
      setUser(userData);
      return userData;
    } catch {
      setUser(null);
      return null;
    }
  };

  const logout = () => {
    // Clear local state and redirect to backend logout
    setUser(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
    window.location.href = `${backendUrl}/logout`;
  };

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await userService.getMe();
        setUser(userData);
      } catch {
        // Not authenticated - this is fine, let the routes handle redirection
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading screen while checking auth
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAuthenticated: !!user,
        refreshUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context.
 * Must be used within AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
