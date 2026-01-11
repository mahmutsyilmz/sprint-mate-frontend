import { useState, useEffect, type KeyboardEvent } from 'react';
import type { Role } from '../types';

/**
 * Skills organized by role category
 */
const FRONTEND_SKILLS = [
  'React', 'Vue', 'Angular', 'Svelte', 'Next.js',
  'TypeScript', 'JavaScript', 'Tailwind', 'CSS', 'HTML',
  'Redux', 'Zustand', 'Vite', 'Webpack',
] as const;

const BACKEND_SKILLS = [
  'Java', 'Spring Boot', 'Node.js', 'Express', 'Go',
  'Python', 'Django', 'FastAPI', 'C#', '.NET',
  'PostgreSQL', 'MongoDB', 'MySQL', 'Redis',
  'Docker', 'Kubernetes', 'AWS', 'GraphQL', 'REST API',
] as const;

const COMMON_SKILLS = [
  'Git', 'CI/CD', 'Testing', 'Agile',
] as const;

interface SkillSelectorProps {
  selectedSkills: string[];
  onChange: (skills: string[]) => void;
  role: Role | null;
  disabled?: boolean;
}

/**
 * Reusable component for selecting tech stack / skills.
 * Shows different skills based on selected role.
 * Includes "Other" input for custom skills.
 */
export function SkillSelector({ selectedSkills, onChange, role, disabled = false }: SkillSelectorProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedSkills));
  const [customSkill, setCustomSkill] = useState('');
  const [customSkills, setCustomSkills] = useState<string[]>([]);

  // Get available skills based on role
  const getAvailableSkills = (): string[] => {
    if (role === 'FRONTEND') {
      return [...FRONTEND_SKILLS, ...COMMON_SKILLS];
    } else if (role === 'BACKEND') {
      return [...BACKEND_SKILLS, ...COMMON_SKILLS];
    }
    // If no role, show all skills
    return [...FRONTEND_SKILLS, ...BACKEND_SKILLS, ...COMMON_SKILLS];
  };

  const availableSkills = getAvailableSkills();

  // Extract custom skills (skills not in predefined lists)
  useEffect(() => {
    const allPredefined = [...FRONTEND_SKILLS, ...BACKEND_SKILLS, ...COMMON_SKILLS];
    const customs = selectedSkills.filter(skill => !allPredefined.includes(skill as any));
    setCustomSkills(customs);
  }, [selectedSkills]);

  // Sync with parent when selectedSkills changes
  useEffect(() => {
    setSelected(new Set(selectedSkills));
  }, [selectedSkills]);

  const toggleSkill = (skill: string) => {
    if (disabled) return;
    
    const newSelected = new Set(selected);
    if (newSelected.has(skill)) {
      newSelected.delete(skill);
    } else {
      newSelected.add(skill);
    }
    setSelected(newSelected);
    onChange(Array.from(newSelected));
  };

  const addCustomSkill = () => {
    const trimmed = customSkill.trim();
    if (!trimmed || disabled) return;
    
    // Check if already exists
    if (selected.has(trimmed)) {
      setCustomSkill('');
      return;
    }

    const newSelected = new Set(selected);
    newSelected.add(trimmed);
    setSelected(newSelected);
    setCustomSkills(prev => [...prev, trimmed]);
    onChange(Array.from(newSelected));
    setCustomSkill('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomSkill();
    }
  };

  const removeCustomSkill = (skill: string) => {
    if (disabled) return;
    
    const newSelected = new Set(selected);
    newSelected.delete(skill);
    setSelected(newSelected);
    setCustomSkills(prev => prev.filter(s => s !== skill));
    onChange(Array.from(newSelected));
  };

  const getSkillIcon = (skill: string): string => {
    const icons: Record<string, string> = {
      'React': '⚛️',
      'Vue': '💚',
      'Angular': '🅰️',
      'Svelte': '🔥',
      'Next.js': '▲',
      'TypeScript': '📘',
      'JavaScript': '💛',
      'Tailwind': '🎨',
      'CSS': '🎨',
      'HTML': '📄',
      'Redux': '💜',
      'Zustand': '🐻',
      'Vite': '⚡',
      'Webpack': '📦',
      'Node.js': '💚',
      'Express': '⚡',
      'Java': '☕',
      'Spring Boot': '🍃',
      'Go': '🐹',
      'Python': '🐍',
      'Django': '🎸',
      'FastAPI': '⚡',
      'C#': '💜',
      '.NET': '💜',
      'Docker': '🐳',
      'Kubernetes': '☸️',
      'AWS': '☁️',
      'PostgreSQL': '🐘',
      'MongoDB': '🍃',
      'MySQL': '🐬',
      'Redis': '🔴',
      'GraphQL': '💗',
      'REST API': '🔗',
      'Git': '📚',
      'CI/CD': '🔄',
      'Testing': '🧪',
      'Agile': '🏃',
    };
    return icons[skill] || '📦';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] text-[#bbbbbb] uppercase tracking-wide font-display">
          Tech Stack / Skills
          {role && (
            <span className={`ml-2 px-1.5 py-0.5 rounded text-[9px] ${
              role === 'FRONTEND' 
                ? 'bg-blue-500/20 text-blue-400' 
                : 'bg-green-500/20 text-green-400'
            }`}>
              {role} focused
            </span>
          )}
        </label>
        <span className="text-[10px] text-[#858585]">
          {selected.size} selected
        </span>
      </div>
      
      {/* Predefined Skills */}
      <div className="flex flex-wrap gap-2">
        {availableSkills.map((skill) => {
          const isSelected = selected.has(skill);
          return (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              disabled={disabled}
              className={`
                px-2.5 py-1 rounded-md text-[11px] font-mono transition-all duration-200
                flex items-center gap-1
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                ${isSelected 
                  ? 'bg-primary/20 text-primary border border-primary shadow-[0_0_8px_rgba(82,250,124,0.2)]' 
                  : 'bg-ide-bg text-[#858585] border border-ide-border hover:border-[#555555] hover:text-[#cccccc]'
                }
              `}
            >
              <span className="text-[9px]">{getSkillIcon(skill)}</span>
              <span>{skill}</span>
            </button>
          );
        })}
      </div>

      {/* Custom Skills Display */}
      {customSkills.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] text-[#858585]">Custom skills:</span>
          <div className="flex flex-wrap gap-2">
            {customSkills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1.5"
              >
                <span>📦</span>
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeCustomSkill(skill)}
                  disabled={disabled}
                  className="ml-1 text-purple-400 hover:text-red-400 transition-colors"
                >
                  <span className="material-symbols-outlined text-[12px]">close</span>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Other / Custom Skill Input */}
      <div className="space-y-2">
        <label className="block text-[10px] text-[#858585]">
          Other skill (press Enter to add):
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Flutter, Rust, Terraform..."
            disabled={disabled}
            className="flex-1 px-3 py-2 bg-ide-bg border border-ide-border rounded text-white text-xs font-mono placeholder-[#555555] focus:outline-none focus:border-purple-500 transition-colors"
          />
          <button
            type="button"
            onClick={addCustomSkill}
            disabled={disabled || !customSkill.trim()}
            className="px-3 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded text-xs font-mono hover:bg-purple-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>
      
      <p className="text-[10px] text-[#858585]">
        Skills will be used for AI-powered project generation.
      </p>
    </div>
  );
}

/**
 * Compact skill badge display for showing skills in profiles.
 * Used in Dashboard and partner info cards.
 */
interface SkillBadgeProps {
  skill: string;
  variant?: 'default' | 'partner';
}

export function SkillBadge({ skill, variant = 'default' }: SkillBadgeProps) {
  const getSkillPrefix = (skill: string): string => {
    // Add @ prefix for backend-related skills (like the design shows)
    const backendSkills = ['Java', 'Spring Boot', 'Go', 'Python', 'Node.js', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Express', 'Django', 'FastAPI', 'MySQL', 'Redis', 'Kubernetes', 'GraphQL', 'REST API', 'C#', '.NET'];
    return backendSkills.includes(skill) ? '@' : '';
  };

  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono
        ${variant === 'partner'
          ? 'bg-syntax-blue/20 text-syntax-blue border border-syntax-blue/30'
          : 'bg-primary/10 text-primary border border-primary/20'
        }
      `}
    >
      {getSkillPrefix(skill)}{skill}
    </span>
  );
}

/**
 * Skills list display component for showing multiple skills.
 */
interface SkillsListProps {
  skills: string[];
  variant?: 'default' | 'partner';
  maxDisplay?: number;
}

export function SkillsList({ skills, variant = 'default', maxDisplay = 6 }: SkillsListProps) {
  if (!skills || skills.length === 0) {
    return (
      <span className="text-[10px] text-[#858585] italic">No skills added</span>
    );
  }

  const displayedSkills = skills.slice(0, maxDisplay);
  const remainingCount = skills.length - maxDisplay;

  return (
    <div className="flex flex-wrap gap-1.5">
      {displayedSkills.map((skill) => (
        <SkillBadge key={skill} skill={skill} variant={variant} />
      ))}
      {remainingCount > 0 && (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-ide-bg text-[#858585] border border-ide-border">
          +{remainingCount} more
        </span>
      )}
    </div>
  );
}
