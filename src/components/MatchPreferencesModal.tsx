import { useState, useEffect, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { userService } from '../services/userService';
import { logger } from '../utils/logger';
import { ThemeSelector } from './ThemeSelector';
import type { User } from '../types';

interface MatchPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onStartMatching: () => void;
  onPreferencesUpdated: () => Promise<void>;
}

const DIFFICULTY_OPTIONS = [
  { value: 1, label: 'Beginner', description: 'Simpler tasks, fewer endpoints' },
  { value: 2, label: 'Intermediate', description: 'Balanced scope and challenge' },
  { value: 3, label: 'Advanced', description: 'Complex patterns, more tasks' },
] as const;

/**
 * Pre-match preferences modal shown before initiating matching.
 * Allows users to set theme, difficulty, and learning goals right before finding a partner.
 */
export function MatchPreferencesModal({
  isOpen,
  onClose,
  user,
  onStartMatching,
  onPreferencesUpdated,
}: MatchPreferencesModalProps) {
  const [preferredThemes, setPreferredThemes] = useState<string[]>(
    user.preference?.preferredThemeCodes || []
  );
  const [difficulty, setDifficulty] = useState<number | null>(
    user.preference?.difficultyPreference ?? null
  );
  const [learningGoals, setLearningGoals] = useState(
    user.preference?.learningGoals || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setPreferredThemes(user.preference?.preferredThemeCodes || []);
      setDifficulty(user.preference?.difficultyPreference ?? null);
      setLearningGoals(user.preference?.learningGoals || '');
    }
  }, [isOpen, user]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, isSubmitting]);

  const handleStartMatching = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const hasPreferences = preferredThemes.length > 0 || difficulty !== null || learningGoals.trim();

      if (hasPreferences) {
        await userService.updateProfile({
          name: user.name,
          preference: {
            difficultyPreference: difficulty,
            preferredThemeCodes: preferredThemes,
            learningGoals: learningGoals.trim() || null,
          },
        });
        await onPreferencesUpdated();
      }

      onStartMatching();
    } catch (error) {
      logger.error('Failed to save preferences:', error);
      toast.error('Failed to save preferences. Please try again.', {
        style: {
          background: '#252526',
          color: '#f87171',
          border: '1px solid #f87171',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipAndMatch = () => {
    onStartMatching();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={!isSubmitting ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl mx-4 bg-ide-panel border border-ide-border rounded-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="h-10 bg-ide-bg border-b border-ide-border flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary">tune</span>
            <span className="text-[#cccccc] text-sm font-display">Sprint Preferences</span>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-6 h-6 flex items-center justify-center text-[#858585] hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleStartMatching} className="p-6 space-y-5 overflow-y-auto flex-1">
          <p className="text-[#cccccc] text-sm">
            Customize your next sprint. These preferences help the AI generate a project that matches your interests.
          </p>

          {/* Theme Selector */}
          <ThemeSelector
            selectedThemes={preferredThemes}
            onChange={setPreferredThemes}
            disabled={isSubmitting}
          />

          {/* Difficulty Preference */}
          <div className="space-y-3">
            <label className="block text-[11px] text-[#bbbbbb] uppercase tracking-wide font-display">
              Difficulty Preference
              <span className="text-[#858585] ml-2 normal-case text-[9px]">(optional)</span>
            </label>
            <div className="flex gap-2">
              {DIFFICULTY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDifficulty(difficulty === option.value ? null : option.value)}
                  disabled={isSubmitting}
                  className={`
                    flex-1 py-2 px-3 rounded-md text-[11px] font-mono transition-all duration-200
                    flex flex-col items-center gap-0.5
                    ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                    ${difficulty === option.value
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                      : 'bg-ide-bg text-[#858585] border border-ide-border hover:border-[#555555] hover:text-[#cccccc]'
                    }
                  `}
                >
                  <span className="font-bold">{option.label}</span>
                  <span className="text-[9px] opacity-70">{option.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Learning Goals */}
          <div className="space-y-2">
            <label className="block text-[11px] text-[#bbbbbb] uppercase tracking-wide font-display">
              Learning Goals
              <span className="text-[#858585] ml-2 normal-case text-[9px]">(optional)</span>
            </label>
            <input
              type="text"
              value={learningGoals}
              onChange={(e) => setLearningGoals(e.target.value)}
              placeholder="e.g., WebSocket, GraphQL, Docker, Redis..."
              disabled={isSubmitting}
              className="w-full px-3 py-2.5 bg-ide-bg border border-ide-border rounded text-white text-xs font-mono placeholder-[#555555] focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <p className="text-[10px] text-[#858585]">
              Technologies or patterns you want to practice. AI will try to include them in your project.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleSkipAndMatch}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm text-[#cccccc] hover:text-white border border-ide-border hover:border-[#cccccc] rounded transition-colors disabled:opacity-50"
            >
              Skip & Match
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm bg-primary text-black font-bold rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                  Saving...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">group_add</span>
                  Start Matching
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
