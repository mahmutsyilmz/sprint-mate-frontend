import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BinaryBackground } from '../components/BinaryBackground';
import { authService } from '../services/authService';
import { useAuth } from '../contexts';

/**
 * Login page with VS Code aesthetic.
 * Displays centered login card with GitHub OAuth button.
 * Redirects authenticated users to appropriate page.
 */
export function Login() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === null) {
        navigate('/role-select', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = () => {
    authService.login();
  };

  return (
    <div className="min-h-screen flex flex-col bg-ide-bg font-mono relative overflow-hidden">
      <BinaryBackground />
      
      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center p-4 z-10">
        {/* Login Card */}
        <div className="w-full max-w-[420px] bg-ide-panel border border-ide-border rounded-lg shadow-[0_20px_50px_-12px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col">
          {/* Window/Tab Bar */}
          <div className="h-10 bg-ide-bg border-b border-ide-border flex items-center justify-between px-4 select-none">
            <div className="flex items-center gap-2">
              <div className="text-[#cccccc] text-xs font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px] text-primary">terminal</span>
                <span>login.tsx</span>
              </div>
            </div>
            <div className="flex gap-2 opacity-60 hover:opacity-100 transition-opacity">
              <div className="w-2.5 h-2.5 rounded-full bg-ide-border"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-ide-border"></div>
            </div>
          </div>

          {/* Editor Content */}
          <div className="p-8 flex flex-col items-center">
            {/* Headline Section */}
            <div className="w-full mb-8 text-center">
              <h2 className="text-white text-[28px] font-bold leading-tight mb-2 tracking-tight">
                <span className="text-primary">&gt;</span> Sprint Mate
                <span className="text-primary animate-cursor">_</span>
              </h2>
              <p className="text-syntax-gray text-sm font-normal">
                Initializing developer pairing sequence...
              </p>
            </div>

            {/* Action Section */}
            <div className="w-full mb-6">
              <button 
                onClick={handleLogin}
                className="group w-full h-12 bg-github-dark hover:bg-black text-white border-l-4 border-l-[#555] hover:border-l-primary flex items-center justify-center gap-3 transition-all duration-200 rounded-sm shadow-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">code</span>
                <span className="font-bold tracking-wide">Login with GitHub</span>
              </button>
              <p className="text-[#555] text-xs mt-3 text-center font-display">
                // Access your 1-week sprint dashboard
              </p>
            </div>

            {/* Decorative Code Snippet */}
            <div className="w-full bg-ide-bg rounded p-3 border border-ide-border opacity-60 hover:opacity-100 transition-opacity duration-300">
              <div className="text-[10px] text-syntax-gray leading-relaxed font-mono">
                <span className="text-syntax-purple">const</span>{' '}
                <span className="text-syntax-blue">session</span> ={' '}
                <span className="text-syntax-purple">await</span>{' '}
                <span className="text-syntax-yellow">authenticate</span>();
                <br />
                <span className="text-syntax-purple">if</span> (session.
                <span className="text-syntax-blue">isValid</span>) {'{'}<br />
                {'  '}<span className="text-syntax-yellow">startSprint</span>();
                <br />
                {'}'}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* VS Code Style Status Bar */}
      <footer className="h-6 bg-ide-blue w-full flex items-center justify-between px-3 text-[11px] text-white select-none z-20 cursor-default font-display">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 hover:bg-white/10 px-1 py-0.5 rounded">
            <span className="material-symbols-outlined text-[12px] font-bold">commit</span>
            <span>main*</span>
          </div>
          <div className="flex items-center gap-1 hover:bg-white/10 px-1 py-0.5 rounded">
            <span className="material-symbols-outlined text-[12px]">sync</span>
            <span>0 ↓ 0 ↑</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline hover:bg-white/10 px-1 py-0.5 rounded">Ln 12, Col 42</span>
          <span className="hidden sm:inline hover:bg-white/10 px-1 py-0.5 rounded">UTF-8</span>
          <span className="hover:bg-white/10 px-1 py-0.5 rounded">TypeScript JSX</span>
          <div className="flex items-center gap-1 hover:bg-white/10 px-1 py-0.5 rounded">
            <span className="material-symbols-outlined text-[14px]">notifications</span>
            <span className="text-[10px] font-bold">Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
