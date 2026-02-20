import { Component, type ReactNode, type ErrorInfo } from 'react';
import { logger } from '../utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary that catches render errors and displays a recovery UI.
 * Class component required because React error boundaries need
 * getDerivedStateFromError and componentDidCatch lifecycle methods.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('ErrorBoundary caught error:', error, errorInfo.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="h-screen flex items-center justify-center bg-ide-bg text-white font-mono">
          <div className="max-w-md text-center p-8">
            <span className="material-symbols-outlined text-[48px] text-red-400 mb-4 block">error</span>
            <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
            <p className="text-syntax-gray text-sm mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-ide-panel border border-ide-border text-[#cccccc] rounded hover:border-primary transition-colors text-sm"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-black font-bold rounded hover:bg-primary/90 transition-colors text-sm"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
