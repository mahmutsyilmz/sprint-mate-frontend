import { useNavigate } from 'react-router-dom';
import { IdeLayout } from '../components';

/**
 * 404 page displayed when users navigate to an unknown route.
 * Uses IDE theme with a terminal-style error message.
 */
export function NotFound() {
  const navigate = useNavigate();

  return (
    <IdeLayout activeFile="404.tsx">
      <div className="flex items-center justify-center h-full">
        <div className="max-w-md text-center p-8">
          <div className="text-[64px] font-bold text-primary mb-2 font-mono">404</div>
          <h1 className="text-xl text-white font-bold mb-2">File Not Found</h1>
          <p className="text-syntax-gray text-sm mb-6 font-mono">
            Error: ENOENT: no such file or directory
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-ide-panel border border-ide-border text-[#cccccc] rounded hover:border-primary transition-colors text-sm"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-primary text-black font-bold rounded hover:bg-primary/90 transition-colors text-sm"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    </IdeLayout>
  );
}
