import { useState, useEffect, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { matchService } from '../services/matchService';
import { logger } from '../utils/logger';
import type { MatchCompletion } from '../types';

type ModalState = 'input' | 'analyzing' | 'result';

interface CompleteSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: string;
  onComplete: (result: MatchCompletion) => void;
}

/**
 * Modal for completing a sprint with GitHub URL submission and AI review.
 * 3-state modal: input -> analyzing -> result
 */
export function CompleteSprintModal({ isOpen, onClose, matchId, onComplete }: CompleteSprintModalProps) {
  const [githubUrl, setGithubUrl] = useState('');
  const [modalState, setModalState] = useState<ModalState>('input');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MatchCompletion | null>(null);
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  // Reset state when modal opens (render-time state adjustment)
  if (isOpen && !prevIsOpen) {
    setGithubUrl('');
    setModalState('input');
    setError(null);
    setResult(null);
  }
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
  }

  // Handle escape key (only in input state)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && modalState === 'input') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, modalState]);

  const validateUrl = (url: string): boolean => {
    const githubPattern = /^https?:\/\/github\.com\/[^/]+\/[^/]+\/?.*$/;
    return githubPattern.test(url);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!githubUrl.trim()) {
      setError('GitHub repository URL is required');
      return;
    }

    if (!validateUrl(githubUrl.trim())) {
      setError('Please enter a valid GitHub repository URL (e.g., https://github.com/user/repo)');
      return;
    }

    // Start analyzing
    setModalState('analyzing');

    try {
      const completionResult = await matchService.completeMatch(matchId, githubUrl.trim());
      setResult(completionResult);
      setModalState('result');
    } catch (err) {
      logger.error('Sprint completion error:', err);
      setModalState('input');
      setError('Failed to complete sprint. Please try again.');
      toast.error('Failed to complete sprint', {
        style: {
          background: '#252526',
          color: '#f87171',
          border: '1px solid #f87171',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
        },
      });
    }
  };

  const handleDone = () => {
    if (result) {
      onComplete(result);
    }
    onClose();
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/50';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/50';
    if (score >= 40) return 'bg-orange-500/20 border-orange-500/50';
    return 'bg-red-500/20 border-red-500/50';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={modalState === 'input' ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-ide-panel border border-ide-border rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="h-10 bg-ide-bg border-b border-ide-border flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary">
              {modalState === 'result' ? 'task_alt' : 'rocket_launch'}
            </span>
            <span className="text-[#cccccc] text-sm font-display">
              {modalState === 'input' && 'Complete Sprint'}
              {modalState === 'analyzing' && 'Analyzing Submission...'}
              {modalState === 'result' && 'Sprint Review'}
            </span>
          </div>
          {modalState === 'input' && (
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center text-[#858585] hover:text-white hover:bg-white/10 rounded transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* INPUT STATE */}
          {modalState === 'input' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <p className="text-[#cccccc] text-sm mb-4">
                  Submit your GitHub repository URL to complete this sprint.
                  Our AI will review your README and provide feedback.
                </p>

                <label className="block text-[11px] text-[#bbbbbb] uppercase tracking-wide mb-2 font-display">
                  GitHub Repository URL *
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username/project"
                  className={`w-full px-3 py-2.5 bg-ide-bg border rounded text-white text-sm font-mono placeholder-[#858585] focus:outline-none focus:border-primary transition-colors ${
                    error ? 'border-red-500' : 'border-ide-border'
                  }`}
                  autoFocus
                />
                {error && (
                  <p className="text-red-400 text-xs mt-2">{error}</p>
                )}
                <p className="text-[10px] text-[#858585] mt-2">
                  Your repository must be public and contain a README.md file.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-[#cccccc] hover:text-white border border-ide-border hover:border-[#cccccc] rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-primary text-black font-bold rounded hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  Submit for Review
                </button>
              </div>
            </form>
          )}

          {/* ANALYZING STATE */}
          {modalState === 'analyzing' && (
            <div className="text-center py-8">
              <div className="mb-4">
                <span className="material-symbols-outlined text-[48px] text-primary animate-pulse">
                  psychology
                </span>
              </div>
              <h3 className="text-white text-lg font-bold mb-2">Analyzing Your Submission</h3>
              <p className="text-[#cccccc] text-sm mb-4">
                Our AI is reviewing your README against the crisis scenario...
              </p>
              <div className="flex items-center justify-center gap-2 text-syntax-gray">
                <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                <span className="text-xs">This may take a moment</span>
              </div>
            </div>
          )}

          {/* RESULT STATE */}
          {modalState === 'result' && result && (
            <div className="space-y-5">
              {/* Score */}
              {result.reviewScore !== null && (
                <div className={`p-4 rounded-lg border ${getScoreBgColor(result.reviewScore)}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[#bbbbbb] text-sm font-display">Review Score</span>
                    <span className={`text-3xl font-bold ${getScoreColor(result.reviewScore)}`}>
                      {result.reviewScore}/100
                    </span>
                  </div>
                </div>
              )}

              {/* Feedback */}
              {result.reviewFeedback && (
                <div>
                  <h4 className="text-[11px] text-[#bbbbbb] uppercase tracking-wide mb-2 font-display flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px]">chat</span>
                    AI Feedback
                  </h4>
                  <p className="text-[#cccccc] text-sm bg-ide-bg border border-ide-border rounded p-3">
                    {result.reviewFeedback}
                  </p>
                </div>
              )}

              {/* Strengths */}
              {result.reviewStrengths && result.reviewStrengths.length > 0 && (
                <div>
                  <h4 className="text-[11px] text-[#bbbbbb] uppercase tracking-wide mb-2 font-display flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px] text-green-400">thumb_up</span>
                    Strengths
                  </h4>
                  <ul className="space-y-1">
                    {result.reviewStrengths.map((strength, idx) => (
                      <li key={idx} className="text-green-400 text-sm flex items-start gap-2">
                        <span className="material-symbols-outlined text-[14px] mt-0.5">check</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Missing Elements */}
              {result.reviewMissingElements && result.reviewMissingElements.length > 0 && (
                <div>
                  <h4 className="text-[11px] text-[#bbbbbb] uppercase tracking-wide mb-2 font-display flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px] text-yellow-400">warning</span>
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-1">
                    {result.reviewMissingElements.map((item, idx) => (
                      <li key={idx} className="text-yellow-400 text-sm flex items-start gap-2">
                        <span className="material-symbols-outlined text-[14px] mt-0.5">remove</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* No Review Data */}
              {!result.reviewScore && !result.reviewFeedback && (
                <div className="text-center py-4">
                  <p className="text-[#cccccc] text-sm">
                    Sprint completed successfully! No AI review was generated.
                  </p>
                </div>
              )}

              {/* Done Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleDone}
                  className="px-6 py-2 text-sm bg-primary text-black font-bold rounded hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
