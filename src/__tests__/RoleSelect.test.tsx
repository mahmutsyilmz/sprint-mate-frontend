import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RoleSelect } from '../pages/RoleSelect';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockRefreshUser = vi.fn();
vi.mock('../contexts', () => ({
  useAuth: () => ({ refreshUser: mockRefreshUser }),
}));

const mockUpdateRole = vi.fn();
vi.mock('../services/userService', () => ({
  userService: {
    updateRole: (...args: unknown[]) => mockUpdateRole(...args),
  },
}));

vi.mock('../components/BinaryBackground', () => ({
  BinaryBackground: () => <div data-testid="binary-bg" />,
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

describe('RoleSelect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateRole.mockResolvedValue({});
    mockRefreshUser.mockResolvedValue({});
  });

  it('should_RenderBothRoleCards', () => {
    render(
      <MemoryRouter>
        <RoleSelect />
      </MemoryRouter>
    );

    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Backend Developer')).toBeInTheDocument();
    expect(screen.getByText(/Select Your Role/)).toBeInTheDocument();
  });

  it('should_CallUpdateRole_When_FrontendSelected', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <RoleSelect />
      </MemoryRouter>
    );

    await user.click(screen.getByText('Frontend Developer'));

    await waitFor(() => {
      expect(mockUpdateRole).toHaveBeenCalledWith('FRONTEND');
    });
  });

  it('should_CallUpdateRole_When_BackendSelected', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <RoleSelect />
      </MemoryRouter>
    );

    await user.click(screen.getByText('Backend Developer'));

    await waitFor(() => {
      expect(mockUpdateRole).toHaveBeenCalledWith('BACKEND');
    });
  });

  it('should_ShowErrorToast_When_UpdateFails', async () => {
    const toast = (await import('react-hot-toast')).default;
    mockUpdateRole.mockRejectedValue(new Error('Network error'));
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <RoleSelect />
      </MemoryRouter>
    );

    await user.click(screen.getByText('Frontend Developer'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
