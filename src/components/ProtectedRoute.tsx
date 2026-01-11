import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, LoadingScreen } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If true, requires user to have a role selected */
  requireRole?: boolean;
}

/**
 * Route wrapper that protects routes requiring authentication.
 * 
 * Behavior:
 * - If loading, shows LoadingScreen
 * - If not authenticated, redirects to /login
 * - If requireRole is true and user has no role, redirects to /role-select
 * - Otherwise, renders children
 */
export function ProtectedRoute({ children, requireRole = false }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading screen while checking auth
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User needs to select a role first
  if (requireRole && user.role === null) {
    return <Navigate to="/role-select" replace />;
  }

  return <>{children}</>;
}

/**
 * Route wrapper for routes that require user to NOT have a role yet.
 * Used for role-select page.
 */
export function RoleSelectRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();

  // Show loading screen while checking auth
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // User already has a role - redirect to dashboard
  if (user.role !== null) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
