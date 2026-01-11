import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { matchService } from '../services/matchService';
import { useAuth } from '../contexts';
import { TerminalPanel, type TerminalLog } from '../components';
import type { MatchStatus } from '../types';

type DashboardState = 'IDLE' | 'WAITING' | 'MATCHED';

/**
 * Main Dashboard page with IDE layout.
 * - Static Explorer panel showing workspace
 * - Editor area displaying project description
 * - Terminal panel as status log with typewriter effect
 */
export function Dashboard() {
  const { user, logout } = useAuth();
  const [matchStatus, setMatchStatus] = useState<MatchStatus | null>(null);
  const [dashboardState, setDashboardState] = useState<DashboardState>('IDLE');
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

  // Generate unique log ID
  const generateLogId = () => `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addLog = useCallback((message: string, type: TerminalLog['type'] = 'info') => {
    setLogs(prev => [...prev, { 
      id: generateLogId(),
      timestamp: new Date(), 
      message, 
      type 
    }]);
  }, []);

  // Initialize terminal with welcome message
  useEffect(() => {
    if (user) {
      addLog(`> Welcome, ${user.name || 'Developer'}!`, 'success');
      addLog(`> Role: ${user.role || 'Not selected'}`, 'info');
      addLog(`> Ready to find a partner. Run 'Find Partner' to start.`, 'info');
    }
  }, [user, addLog]);

  // Polling for match updates when waiting
  useEffect(() => {
    if (!isPolling || dashboardState !== 'WAITING') return;

    const pollInterval = setInterval(async () => {
      try {
        const status = await matchService.findMatch();
        
        if (status.status === 'MATCHED') {
          setMatchStatus(status);
          setDashboardState('MATCHED');
          setIsPolling(false);
          
          addLog(`> Match Found!`, 'success');
          addLog(`> Partner: @${status.partnerName} (${status.partnerRole})`, 'success');
          addLog(`> Project: ${status.projectTitle}`, 'success');
          
          toast.success('Match found! Check your project details.', {
            duration: 5000,
            style: {
              background: '#252526',
              color: '#52fa7c',
              border: '1px solid #52fa7c',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
            },
            iconTheme: {
              primary: '#52fa7c',
              secondary: '#252526',
            },
          });
        } else if (status.status === 'WAITING') {
          // Update queue position
          setMatchStatus(status);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, [isPolling, dashboardState, addLog]);

  const handleFindMatch = async () => {
    setIsLoading(true);
    addLog('> Searching for partner...', 'info');
    
    try {
      const status = await matchService.findMatch();
      setMatchStatus(status);
      
      if (status.status === 'MATCHED') {
        setDashboardState('MATCHED');
        addLog(`> Match Found!`, 'success');
        addLog(`> Partner: @${status.partnerName} (${status.partnerRole})`, 'success');
        addLog(`> Project: ${status.projectTitle}`, 'success');
        
        toast.success('Partner matched! Start your sprint.', {
          duration: 4000,
          style: {
            background: '#252526',
            color: '#52fa7c',
            border: '1px solid #52fa7c',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
          },
        });
      } else {
        setDashboardState('WAITING');
        setIsPolling(true);
        addLog(`> Added to queue. Position: ${status.queuePosition}`, 'warning');
        addLog(`> Waiting for ${user?.role === 'FRONTEND' ? 'Backend' : 'Frontend'} developer...`, 'info');
        
        toast('Added to matching queue...', {
          duration: 3000,
          icon: '⏳',
          style: {
            background: '#252526',
            color: '#facc15',
            border: '1px solid #facc15',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
          },
        });
      }
    } catch (err) {
      addLog('> Failed to find match. Please try again.', 'error');
      toast.error('Failed to find match. Please try again.', {
        style: {
          background: '#252526',
          color: '#f87171',
          border: '1px solid #f87171',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
        },
      });
      console.error('Find match error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelWaiting = async () => {
    try {
      await matchService.cancelWaiting();
      setMatchStatus(null);
      setDashboardState('IDLE');
      setIsPolling(false);
      addLog('> Left the waiting queue.', 'info');
      
      toast('Left the queue', {
        icon: '👋',
        style: {
          background: '#252526',
          color: '#cccccc',
          border: '1px solid #3e3e42',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
        },
      });
    } catch (err) {
      addLog('> Failed to leave queue.', 'error');
      console.error('Cancel waiting error:', err);
    }
  };

  const handleCompleteSprint = async () => {
    if (!matchStatus?.matchId) return;
    
    setIsLoading(true);
    addLog('> Completing sprint...', 'info');
    
    try {
      await matchService.completeMatch(matchStatus.matchId);
      addLog('> Sprint committed successfully. Repo saved.', 'success');
      addLog('> Great work! Ready for next sprint.', 'success');
      
      setMatchStatus(null);
      setDashboardState('IDLE');
      
      toast.success('Sprint completed! 🎉', {
        duration: 5000,
        style: {
          background: '#252526',
          color: '#52fa7c',
          border: '1px solid #52fa7c',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
        },
      });
    } catch (err) {
      addLog('> Failed to complete sprint.', 'error');
      toast.error('Failed to complete sprint.', {
        style: {
          background: '#252526',
          color: '#f87171',
          border: '1px solid #f87171',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
        },
      });
      console.error('Complete sprint error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-ide-bg text-white font-mono overflow-hidden">
      {/* Top Menu Bar */}
      <header className="h-8 bg-ide-panel border-b border-ide-border flex items-center px-3 select-none text-xs">
        <div className="flex items-center gap-4 text-[#cccccc]">
          <span className="opacity-60 cursor-default">File</span>
          <span className="opacity-60 cursor-default">Edit</span>
          <span className="opacity-60 cursor-default">View</span>
          <span className="opacity-60 cursor-default">Go</span>
          <span className="opacity-60 cursor-default">Run</span>
          <span className="opacity-60 cursor-default">Help</span>
        </div>
        <div className="flex-1 text-center text-[#858585] font-display text-[11px]">
          Sprint Mate - Dashboard
        </div>
        <div className="flex items-center gap-2 opacity-60">
          <div className="w-3 h-3 rounded-full bg-ide-border"></div>
          <div className="w-3 h-3 rounded-full bg-ide-border"></div>
          <div className="w-3 h-3 rounded-full bg-ide-border"></div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar */}
        <aside className="w-12 bg-ide-panel border-r border-ide-border flex flex-col items-center py-2 gap-4">
          <button className="w-10 h-10 flex items-center justify-center text-primary cursor-default">
            <span className="material-symbols-outlined text-[24px]">folder</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-[#858585] opacity-60 cursor-default">
            <span className="material-symbols-outlined text-[24px]">search</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-[#858585] opacity-60 cursor-default">
            <span className="material-symbols-outlined text-[24px]">commit</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-[#858585] opacity-60 cursor-default">
            <span className="material-symbols-outlined text-[24px]">bug_report</span>
          </button>
          <div className="flex-1" />
          <button 
            onClick={logout}
            className="w-10 h-10 flex items-center justify-center text-[#858585] opacity-60 hover:opacity-100 hover:text-red-400 cursor-pointer transition-colors"
            title="Logout"
          >
            <span className="material-symbols-outlined text-[24px]">logout</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-[#858585] opacity-60 cursor-default">
            <span className="material-symbols-outlined text-[24px]">settings</span>
          </button>
        </aside>

        {/* Explorer Panel - STATIC */}
        <aside className="w-60 bg-ide-panel border-r border-ide-border flex flex-col">
          <div className="h-8 px-4 flex items-center justify-between text-[11px] text-[#bbbbbb] uppercase tracking-wide font-display">
            <span>Explorer</span>
            <span className="material-symbols-outlined text-[16px] opacity-60">more_horiz</span>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="px-2 py-1">
              {/* Static workspace tree */}
              <div className="flex items-center gap-1 px-2 py-1 text-[#cccccc] text-xs">
                <span className="material-symbols-outlined text-[14px]">expand_more</span>
                <span className="font-bold uppercase">Sprint Workspace</span>
              </div>
              
              {dashboardState === 'MATCHED' && matchStatus ? (
                <div className="ml-4">
                  <div className="flex items-center gap-1 px-2 py-0.5 text-[#cccccc] text-xs hover:bg-white/5 rounded cursor-default">
                    <span className="material-symbols-outlined text-[14px]">expand_more</span>
                    <span className="material-symbols-outlined text-[14px] text-primary">folder</span>
                    <span>{matchStatus.projectTitle}</span>
                  </div>
                  <div className="ml-6">
                    <div className="flex items-center gap-1 px-2 py-0.5 text-[#cccccc] text-xs hover:bg-white/5 rounded cursor-default bg-white/10">
                      <span className="material-symbols-outlined text-[14px] text-syntax-blue">description</span>
                      <span>README.md</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="ml-4 px-2 py-2 text-syntax-gray text-xs italic">
                  No active project
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor Area */}
          <div className="flex-1 overflow-auto">
            {/* Tab Bar */}
            <div className="h-9 bg-ide-bg border-b border-ide-border flex items-center">
              <div className="h-full px-4 flex items-center gap-2 bg-ide-panel border-r border-ide-border text-[#cccccc] text-xs">
                <span className="material-symbols-outlined text-[14px] text-syntax-blue">description</span>
                <span>README.md</span>
                <span className="material-symbols-outlined text-[14px] opacity-40 hover:opacity-100">close</span>
              </div>
            </div>

            {/* Editor Content - README Preview Style */}
            <div className="p-6 overflow-auto h-[calc(100%-36px)]">
              {dashboardState === 'MATCHED' && matchStatus ? (
                <ProjectReadme 
                  title={matchStatus.projectTitle || ''}
                  description={matchStatus.projectDescription || ''}
                  partnerName={matchStatus.partnerName || ''}
                  partnerRole={matchStatus.partnerRole || ''}
                  meetingUrl={matchStatus.meetingUrl || ''}
                  onComplete={handleCompleteSprint}
                  isLoading={isLoading}
                />
              ) : (
                <WelcomeView 
                  user={user}
                  dashboardState={dashboardState}
                  queuePosition={matchStatus?.queuePosition}
                  onFindMatch={handleFindMatch}
                  onCancelWaiting={handleCancelWaiting}
                  isLoading={isLoading}
                />
              )}
            </div>
          </div>

          {/* Terminal Panel - Dynamic with typewriter effect */}
          <TerminalPanel logs={logs} isPolling={isPolling} />
        </div>
      </div>

      {/* Status Bar */}
      <footer className="h-6 bg-ide-blue flex items-center justify-between px-3 text-[11px] text-white select-none font-display">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 px-1 py-0.5">
            <span className="material-symbols-outlined text-[12px]">commit</span>
            <span>main*</span>
          </div>
          <div className="flex items-center gap-1 px-1 py-0.5">
            <span className="material-symbols-outlined text-[12px]">sync</span>
            <span>0 ↓ 0 ↑</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 px-1 py-0.5">
            <span className="material-symbols-outlined text-[12px]">error</span>
            <span>0</span>
            <span className="material-symbols-outlined text-[12px]">warning</span>
            <span>0</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">Ln 15, Col 42</span>
          <span className="hidden sm:inline">UTF-8</span>
          <span>Markdown</span>
          <div className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${
              dashboardState === 'MATCHED' ? 'bg-primary' : 
              dashboardState === 'WAITING' ? 'bg-yellow-400 animate-pulse' : 
              'bg-syntax-gray'
            }`} />
            <span className="text-[10px] font-bold">
              {dashboardState === 'MATCHED' ? 'Sprint Active' :
               dashboardState === 'WAITING' ? 'In Queue' :
               'Ready'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">person</span>
            <span className="text-[10px] font-bold">{user?.name || 'Loading...'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Welcome view when no active match
function WelcomeView({ 
  user, 
  dashboardState,
  queuePosition,
  onFindMatch, 
  onCancelWaiting,
  isLoading 
}: {
  user: ReturnType<typeof useAuth>['user'];
  dashboardState: DashboardState;
  queuePosition?: number | null;
  onFindMatch: () => void;
  onCancelWaiting: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <span className="material-symbols-outlined text-[48px] text-primary">code</span>
        <div>
          <h1 className="text-2xl font-bold text-white">Sprint Mate</h1>
          <p className="text-syntax-gray text-sm">Pair Programming Platform</p>
        </div>
      </div>

      <div className="bg-ide-panel border border-ide-border rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">rocket_launch</span>
          Quick Start
        </h2>
        
        <div className="space-y-3 text-sm text-[#cccccc]">
          <div className="flex items-start gap-3">
            <span className="text-primary font-bold">1.</span>
            <span>Your role: <span className="text-primary font-bold">{user?.role || 'Not selected'}</span></span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-primary font-bold">2.</span>
            <span>Click "Find Partner" to join the matching queue</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-primary font-bold">3.</span>
            <span>Get paired with a {user?.role === 'FRONTEND' ? 'Backend' : 'Frontend'} developer</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-primary font-bold">4.</span>
            <span>Complete a 1-week project sprint together!</span>
          </div>
        </div>
      </div>

      {dashboardState === 'WAITING' ? (
        <div className="text-center">
          <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-6 mb-4">
            <span className="material-symbols-outlined text-[32px] text-yellow-400 mb-2 animate-pulse">hourglass_top</span>
            <p className="text-yellow-400 font-bold">Waiting for Partner...</p>
            <p className="text-syntax-gray text-sm mt-1">Queue Position: {queuePosition}</p>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-syntax-gray">
              <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
              <span>Auto-checking for matches...</span>
            </div>
          </div>
          <button
            onClick={onCancelWaiting}
            className="px-6 py-2 bg-ide-panel border border-ide-border text-[#cccccc] rounded hover:border-red-500 hover:text-red-400 transition-colors"
          >
            Cancel Waiting
          </button>
        </div>
      ) : (
        <button
          onClick={onFindMatch}
          disabled={isLoading || !user?.role}
          className="w-full py-4 bg-github-dark hover:bg-black text-white border-l-4 border-l-primary rounded font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined">group_add</span>
          {isLoading ? 'Searching...' : 'Find Partner'}
        </button>
      )}

      {!user?.role && (
        <p className="text-red-400 text-sm mt-3 text-center">
          Please select a role first to find a partner.
        </p>
      )}
    </div>
  );
}

// Project README preview when matched
function ProjectReadme({ 
  title, 
  description, 
  partnerName, 
  partnerRole,
  meetingUrl,
  onComplete,
  isLoading 
}: {
  title: string;
  description: string;
  partnerName: string;
  partnerRole: string;
  meetingUrl: string;
  onComplete: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="max-w-3xl mx-auto prose prose-invert">
      {/* Project Title */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-ide-border">
        <span className="material-symbols-outlined text-[40px] text-primary">folder_special</span>
        <div>
          <h1 className="text-2xl font-bold text-white m-0">{title}</h1>
          <p className="text-syntax-gray text-sm m-0">Sprint Project Assignment</p>
        </div>
      </div>

      {/* Partner Info Card */}
      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[32px] text-primary">group</span>
          <div>
            <p className="text-primary font-bold m-0">Your Partner</p>
            <p className="text-white m-0">@{partnerName} <span className="text-syntax-gray">({partnerRole})</span></p>
          </div>
        </div>
        {meetingUrl && (
          <a 
            href={meetingUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-ide-blue text-white rounded hover:bg-blue-600 transition-colors no-underline"
          >
            <span className="material-symbols-outlined text-[18px]">videocam</span>
            Join Meeting
          </a>
        )}
      </div>

      {/* Project Description */}
      <div className="bg-ide-panel border border-ide-border rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 mt-0">
          <span className="material-symbols-outlined text-syntax-blue">description</span>
          Project Brief
        </h2>
        <div className="text-[#cccccc] text-sm whitespace-pre-wrap leading-relaxed">
          {description}
        </div>
      </div>

      {/* Complete Sprint Button */}
      <div className="text-center pt-4 border-t border-ide-border">
        <button
          onClick={onComplete}
          disabled={isLoading}
          className="px-8 py-3 bg-primary text-black font-bold rounded hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
        >
          <span className="material-symbols-outlined">check_circle</span>
          {isLoading ? 'Completing...' : 'Complete Sprint'}
        </button>
        <p className="text-syntax-gray text-xs mt-2">
          Click when your 1-week sprint is finished
        </p>
      </div>
    </div>
  );
}
