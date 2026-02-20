import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Login } from '../pages/Login';

// Mock auth context
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockUseAuth = vi.fn();
vi.mock('../contexts', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('../services/authService', () => ({
  authService: {
    login: vi.fn(),
  },
}));

vi.mock('../components/BinaryBackground', () => ({
  BinaryBackground: () => <div data-testid="binary-bg" />,
}));

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it('should_RenderLoginButton_When_NotAuthenticated', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText('Login with GitHub')).toBeInTheDocument();
    expect(screen.getByText(/Sprint Mate/)).toBeInTheDocument();
  });

  it('should_CallAuthLogin_When_ButtonClicked', async () => {
    const { authService } = await import('../services/authService');
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.click(screen.getByText('Login with GitHub'));
    expect(authService.login).toHaveBeenCalledOnce();
  });

  it('should_RenderNothing_When_Authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', name: 'Test', role: 'FRONTEND' },
      isAuthenticated: true,
      isLoading: false,
    });

    const { container } = render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(container.innerHTML).toBe('');
  });

  it('should_RedirectToRoleSelect_When_AuthenticatedWithoutRole', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', name: 'Test', role: null },
      isAuthenticated: true,
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/role-select', { replace: true });
  });

  it('should_RedirectToDashboard_When_AuthenticatedWithRole', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', name: 'Test', role: 'BACKEND' },
      isAuthenticated: true,
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
  });
});
