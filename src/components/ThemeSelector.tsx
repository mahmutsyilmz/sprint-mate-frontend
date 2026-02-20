import { useState, useEffect, useMemo } from 'react';
import { themeService } from '../services/themeService';
import type { ProjectTheme } from '../types';

interface ThemeSelectorProps {
  selectedThemes: string[];
  onChange: (themes: string[]) => void;
  disabled?: boolean;
}

const THEME_ICONS: Record<string, string> = {
  finance: '💰',
  health: '🏋️',
  education: '📚',
  gaming: '🎮',
  social: '💬',
  'e-commerce': '🛒',
  productivity: '📋',
  entertainment: '🎬',
};

/**
 * Multi-select chip component for choosing preferred project themes.
 * Fetches available themes from the backend on mount.
 */
export function ThemeSelector({ selectedThemes, onChange, disabled = false }: ThemeSelectorProps) {
  const [themes, setThemes] = useState<ProjectTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const selected = useMemo(() => new Set(selectedThemes), [selectedThemes]);

  useEffect(() => {
    themeService.getAll()
      .then(setThemes)
      .catch(() => setThemes([]))
      .finally(() => setLoading(false));
  }, []);

  const toggleTheme = (code: string) => {
    if (disabled) return;

    const newSelected = new Set(selected);
    if (newSelected.has(code)) {
      newSelected.delete(code);
    } else {
      newSelected.add(code);
    }
    onChange(Array.from(newSelected));
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <label className="block text-[11px] text-[#bbbbbb] uppercase tracking-wide font-display">
          Preferred Themes
        </label>
        <div className="text-[10px] text-[#858585]">Loading themes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] text-[#bbbbbb] uppercase tracking-wide font-display">
          Preferred Themes
          <span className="text-[#858585] ml-2 normal-case text-[9px]">(optional)</span>
        </label>
        <span className="text-[10px] text-[#858585]">
          {selected.size} selected
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {themes.map((theme) => {
          const isSelected = selected.has(theme.code);
          return (
            <button
              key={theme.code}
              type="button"
              onClick={() => toggleTheme(theme.code)}
              disabled={disabled}
              className={`
                px-2.5 py-1.5 rounded-md text-[11px] font-mono transition-all duration-200
                flex items-center gap-1.5
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                ${isSelected
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                  : 'bg-ide-bg text-[#858585] border border-ide-border hover:border-[#555555] hover:text-[#cccccc]'
                }
              `}
            >
              <span className="text-[12px]">{THEME_ICONS[theme.code] || '📦'}</span>
              <span>{theme.displayName}</span>
            </button>
          );
        })}
      </div>

      <p className="text-[10px] text-[#858585]">
        AI will prioritize themes both you and your partner prefer.
      </p>
    </div>
  );
}
