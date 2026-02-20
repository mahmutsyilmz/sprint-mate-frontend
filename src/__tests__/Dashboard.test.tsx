import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Dashboard } from '../pages/Dashboard';
import type { User, ActiveMatchInfo } from '../types';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockUseAuth = vi.fn();
vi.mock('../contexts', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('../services/userService', () => ({
  userService: {
    getMe: vi.fn(),
    updateProfile: vi.fn(),
  },
}));

vi.mock('../services/matchService', () => ({
  matchService: {
    findMatch: vi.fn(),
    getMatchStatus: vi.fn(),
    cancelWaiting: vi.fn(),
    completeMatch: vi.fn(),
  },
}));

vi.mock('../components/BinaryBackground', () => ({
  BinaryBackground: () => <div data-testid="binary-bg" />,
}));

vi.mock('../components', () => ({
  TerminalPanel: () => <div data-testid="terminal-panel" />,
  EditProfileModal: () => <div data-testid="edit-profile-modal" />,
  SkillsList: () => <div data-testid="skills-list" />,
  ChatPanel: () => <div data-testid="chat-panel" />,
  CompleteSprintModal: () => <div data-testid="complete-sprint-modal" />,
  MatchPreferencesModal: () => <div data-testid="match-preferences-modal" />,
}));

// Suppress toast in tests
vi.mock('react-hot-toast', () => ({
  default: {
    loading: vi.fn(() => 'toast-id'),
    success: vi.fn(),
    error: vi.fn(),
    dismiss: vi.fn(),
  },
}));

const baseUser: User = {
  id: 'user-1',
  githubUrl: 'https://github.com/testuser',
  name: 'Test User',
  surname: null,
  role: 'FRONTEND',
  bio: 'A developer',
  skills: ['React', 'TypeScript'],
};

const activeMatchInfo: ActiveMatchInfo = {
  matchId: 'match-1',
  communicationLink: 'https://meet.google.com/abc',
  partnerName: 'Partner User',
  partnerRole: 'BACKEND',
  partnerSkills: ['Java', 'Spring'],
  projectTitle: 'Test Project',
  projectDescription: 'A test project',
};

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should_RenderUserName_When_NoActiveMatch', () => {
    mockUseAuth.mockReturnValue({
      user: baseUser,
      isAuthenticated: true,
      isLoading: false,
      hasActiveMatch: false,
      activeMatch: null,
      refreshUser: vi.fn(),
      refreshStatus: vi.fn(),
      clearActiveMatch: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // User name appears multiple times in the UI (header, sidebar, status bar)
    const userNames = screen.getAllByText('Test User');
    expect(userNames.length).toBeGreaterThan(0);
  });

  it('should_ShowPartnerInfo_When_HasActiveMatch', () => {
    mockUseAuth.mockReturnValue({
      user: baseUser,
      isAuthenticated: true,
      isLoading: false,
      hasActiveMatch: true,
      activeMatch: activeMatchInfo,
      refreshUser: vi.fn(),
      refreshStatus: vi.fn(),
      clearActiveMatch: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getAllByText('Test User').length).toBeGreaterThan(0);
    expect(screen.getByText(/Partner User/)).toBeInTheDocument();
  });

  it('should_RenderFindMatchButton_When_IdleState', () => {
    mockUseAuth.mockReturnValue({
      user: baseUser,
      isAuthenticated: true,
      isLoading: false,
      hasActiveMatch: false,
      activeMatch: null,
      refreshUser: vi.fn(),
      refreshStatus: vi.fn(),
      clearActiveMatch: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /Find Partner/i })).toBeInTheDocument();
  });
});
