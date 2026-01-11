import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BinaryBackground } from '../components/BinaryBackground';
import { userService } from '../services/userService';
import { useAuth } from '../contexts';
import type { Role } from '../types';

interface RoleCardProps {
  role: Role;
  title: string;
  icon: string;
  codeSnippet: React.ReactNode;
  isSelected: boolean;
  isLoading: boolean;
  onSelect: () => void;
}

function RoleCard({ role, title, icon, codeSnippet, isSelected, isLoading, onSelect }: RoleCardProps) {
  return (
    <button
      onClick={onSelect}
      disabled={isLoading}
      className={`
        w-full max-w-[320px] bg-ide-panel border rounded-lg overflow-hidden flex flex-col
        transition-all duration-200 cursor-pointer
        ${isSelected 
          ? 'border-primary shadow-[0_0_20px_rgba(82,250,124,0.3)]' 
          : 'border-ide-border hover:border-[#555] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)]'
        }
        ${isLoading ? 'opacity-50' : ''}
      `}
    >
      {/* Tab Bar */}
      <div className="h-8 bg-ide-bg border-b border-ide-border flex items-center justify-between px-3 select-none">
        <div className="flex items-center gap-2">
          <span className={`material-symbols-outlined text-[14px] ${isSelected ? 'text-primary' : 'text-syntax-gray'}`}>
            {icon}
          </span>
          <span className="text-[#cccccc] text-xs">{role.toLowerCase()}.tsx</span>
        </div>
        {isSelected && (
          <span className="material-symbols-outlined text-[14px] text-primary">check_circle</span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-white text-lg font-bold mb-2 flex items-center gap-2">
          <span className="text-primary">&gt;</span> {title}
        </h3>
        
        {/* Code Preview */}
        <div className="bg-ide-bg rounded p-3 border border-ide-border text-left">
          <div className="text-[11px] text-syntax-gray leading-relaxed font-mono">
            {codeSnippet}
          </div>
        </div>
      </div>
    </button>
  );
}

/**
 * Role Selection page.
 * User chooses between FRONTEND or BACKEND role.
 * Calls userService.updateRole() and shows toast notifications.
 */
export function RoleSelect() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectRole = async (role: Role) => {
    setSelectedRole(role);
    setIsLoading(true);

    // Create loading toast
    const loadingToast = toast.loading(
      `Configuring ${role.toLowerCase()} environment...`,
      {
        style: {
          background: '#252526',
          color: '#cccccc',
          border: '1px solid #3e3e42',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
        },
        iconTheme: {
          primary: '#52fa7c',
          secondary: '#252526',
        },
      }
    );

    try {
      await userService.updateRole(role);
      await refreshUser();
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success(
        `Role set to ${role}! Redirecting to dashboard...`,
        {
          duration: 2000,
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
        }
      );

      // Slight delay for toast visibility before redirect
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(
        'Failed to update role. Please try again.',
        {
          duration: 4000,
          style: {
            background: '#252526',
            color: '#f87171',
            border: '1px solid #f87171',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
          },
          iconTheme: {
            primary: '#f87171',
            secondary: '#252526',
          },
        }
      );
      setSelectedRole(null);
      console.error('Role update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const frontendCode = (
    <>
      <span className="text-syntax-purple">import</span> {'{'} React {'}'} <span className="text-syntax-purple">from</span> <span className="text-[#ce9178]">'react'</span>;
      <br />
      <span className="text-syntax-purple">import</span> {'{'} Component {'}'} <span className="text-syntax-purple">from</span> <span className="text-[#ce9178]">'./ui'</span>;
      <br /><br />
      <span className="text-syntax-purple">export</span> <span className="text-syntax-purple">function</span> <span className="text-syntax-yellow">App</span>() {'{'}
      <br />
      {'  '}<span className="text-syntax-purple">return</span> {'<'}<span className="text-syntax-blue">Component</span> {'/>'};
      <br />
      {'}'}
    </>
  );

  const backendCode = (
    <>
      <span className="text-syntax-purple">@RestController</span>
      <br />
      <span className="text-syntax-purple">public class</span> <span className="text-syntax-blue">ApiController</span> {'{'}
      <br /><br />
      {'  '}<span className="text-syntax-purple">@GetMapping</span>(<span className="text-[#ce9178]">"/api"</span>)
      <br />
      {'  '}<span className="text-syntax-purple">public</span> <span className="text-syntax-blue">Response</span> <span className="text-syntax-yellow">getData</span>() {'{'}
      <br />
      {'    '}<span className="text-syntax-purple">return</span> <span className="text-syntax-blue">Response</span>.ok();
      <br />
      {'  }'}
      <br />
      {'}'}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-ide-bg font-mono relative overflow-hidden">
      <BinaryBackground />
      
      <main className="flex-grow flex flex-col items-center justify-center p-4 z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-white text-2xl font-bold mb-2">
            <span className="text-primary">&gt;</span> Select Your Role
            <span className="text-primary animate-cursor">_</span>
          </h1>
          <p className="text-syntax-gray text-sm font-display">
            // Choose your expertise to find the perfect partner
          </p>
        </div>

        {/* Role Cards */}
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <RoleCard
            role="FRONTEND"
            title="Frontend Developer"
            icon="web"
            codeSnippet={frontendCode}
            isSelected={selectedRole === 'FRONTEND'}
            isLoading={isLoading}
            onSelect={() => handleSelectRole('FRONTEND')}
          />
          
          <RoleCard
            role="BACKEND"
            title="Backend Developer"
            icon="dns"
            codeSnippet={backendCode}
            isSelected={selectedRole === 'BACKEND'}
            isLoading={isLoading}
            onSelect={() => handleSelectRole('BACKEND')}
          />
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="mt-6 flex items-center gap-3 bg-ide-panel border border-ide-border rounded-lg px-4 py-3">
            <span className="material-symbols-outlined text-[18px] text-primary animate-spin">sync</span>
            <span className="text-[#cccccc] text-sm">
              Configuring {selectedRole?.toLowerCase()} environment...
            </span>
          </div>
        )}
      </main>

      {/* Status Bar */}
      <footer className="h-6 bg-ide-blue w-full flex items-center justify-between px-3 text-[11px] text-white select-none z-20 font-display">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 px-1 py-0.5">
            <span className="material-symbols-outlined text-[12px]">commit</span>
            <span>main*</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">TypeScript JSX</span>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">person</span>
            <span className="text-[10px] font-bold">
              {isLoading ? 'Configuring...' : 'Select Role'}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
