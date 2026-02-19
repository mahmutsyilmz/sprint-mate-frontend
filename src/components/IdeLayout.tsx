import type { ReactNode } from 'react';
import type { User } from '../types';

interface IdeLayoutProps {
  children: ReactNode;
  user?: User | null;
  activeFile?: string;
  showSidebar?: boolean;
}

/**
 * IDE-styled layout wrapper providing the VS Code aesthetic.
 * All IDE features are purely decorative - no actual functionality.
 */
export function IdeLayout({ 
  children, 
  user, 
  activeFile = 'welcome.tsx',
  showSidebar = false 
}: IdeLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-ide-bg text-white font-mono overflow-hidden">
      {/* Top Menu Bar - Static/Decorative */}
      <header className="h-8 bg-ide-panel border-b border-ide-border flex items-center px-3 select-none text-xs">
        <div className="flex items-center gap-4 text-[#cccccc]">
          {/* Decorative menu items - non-functional */}
          <span className="opacity-60 hover:opacity-100 cursor-default">File</span>
          <span className="opacity-60 hover:opacity-100 cursor-default">Edit</span>
          <span className="opacity-60 hover:opacity-100 cursor-default">View</span>
          <span className="opacity-60 hover:opacity-100 cursor-default">Go</span>
          <span className="opacity-60 hover:opacity-100 cursor-default">Run</span>
          <span className="opacity-60 hover:opacity-100 cursor-default">Help</span>
        </div>
        <div className="flex-1 text-center text-[#858585] font-display text-[11px]">
          Sprint Mate - {activeFile}
        </div>
        <div className="flex items-center gap-2 opacity-60">
          <div className="w-3 h-3 rounded-full bg-ide-border"></div>
          <div className="w-3 h-3 rounded-full bg-ide-border"></div>
          <div className="w-3 h-3 rounded-full bg-ide-border"></div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar - Decorative Icons */}
        <aside className="w-12 bg-ide-panel border-r border-ide-border flex flex-col items-center py-2 gap-4">
          <button className="w-10 h-10 flex items-center justify-center text-primary opacity-100 cursor-default">
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
          <button className="w-10 h-10 flex items-center justify-center text-[#858585] opacity-60 cursor-default">
            <span className="material-symbols-outlined text-[24px]">settings</span>
          </button>
        </aside>

        {/* Optional Sidebar Panel */}
        {showSidebar && (
          <aside className="w-60 bg-ide-panel border-r border-ide-border">
            <div className="h-8 px-4 flex items-center justify-between text-[11px] text-[#bbbbbb] uppercase tracking-wide font-display">
              <span>Explorer</span>
              <span className="material-symbols-outlined text-[16px] opacity-60">more_horiz</span>
            </div>
            <div className="px-2 py-1">
              <div className="flex items-center gap-1 px-2 py-1 text-[#cccccc] text-xs">
                <span className="material-symbols-outlined text-[14px]">expand_more</span>
                <span className="font-bold">SPRINT WORKSPACE</span>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Status Bar */}
      <StatusBar user={user} />
    </div>
  );
}

function StatusBar({ user }: { user?: User | null }) {
  return (
    <footer className="h-6 bg-ide-blue flex items-center justify-between px-3 text-[11px] text-white select-none font-display">
      <div className="flex items-center gap-4">
        {/* Git branch indicator - decorative */}
        <div className="flex items-center gap-1 hover:bg-white/10 px-1 py-0.5 rounded cursor-default">
          <span className="material-symbols-outlined text-[12px]">commit</span>
          <span>main*</span>
        </div>
        {/* Sync indicator - decorative */}
        <div className="flex items-center gap-1 hover:bg-white/10 px-1 py-0.5 rounded cursor-default">
          <span className="material-symbols-outlined text-[12px]">sync</span>
          <span>0 ↓ 0 ↑</span>
        </div>
        {/* Error/Warning count - decorative */}
        <div className="hidden sm:flex items-center gap-1 hover:bg-white/10 px-1 py-0.5 rounded cursor-default">
          <span className="material-symbols-outlined text-[12px]">error</span>
          <span>0</span>
          <span className="material-symbols-outlined text-[12px]">warning</span>
          <span>0</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {/* Decorative editor info */}
        <span className="hidden sm:inline hover:bg-white/10 px-1 py-0.5 rounded cursor-default">Ln 15, Col 42</span>
        <span className="hidden sm:inline hover:bg-white/10 px-1 py-0.5 rounded cursor-default">UTF-8</span>
        <span className="hover:bg-white/10 px-1 py-0.5 rounded cursor-default">TypeScript JSX</span>
        {/* User status - real data */}
        <div className="flex items-center gap-1 hover:bg-white/10 px-1 py-0.5 rounded cursor-default">
          <span className="material-symbols-outlined text-[14px]">
            {user ? 'person' : 'person_off'}
          </span>
          <span className="text-[10px] font-bold">
            {user ? user.name || 'Online' : 'Offline'}
          </span>
        </div>
      </div>
    </footer>
  );
}
