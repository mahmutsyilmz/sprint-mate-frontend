import { useState, useEffect, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { userService } from '../services/userService';
import type { User } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onProfileUpdated: () => Promise<void>;
}

/**
 * Modal for editing user profile (name and bio).
 * IDE/Dark theme aesthetic with minimalist design.
 */
export function EditProfileModal({ isOpen, onClose, user, onProfileUpdated }: EditProfileModalProps) {
  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState(user.bio || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; bio?: string }>({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(user.name || '');
      setBio(user.bio || '');
      setErrors({});
    }
  }, [isOpen, user]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const validate = (): boolean => {
    const newErrors: { name?: string; bio?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.length > 100) {
      newErrors.name = 'Name must be at most 100 characters';
    }
    
    if (bio && bio.length > 255) {
      newErrors.bio = 'Bio must be at most 255 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      await userService.updateProfile({
        name: name.trim(),
        bio: bio.trim() || null,
      });
      
      // Refresh user data in context
      await onProfileUpdated();
      
      toast.success('Profile updated successfully!', {
        duration: 3000,
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
      });
      
      onClose();
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile. Please try again.', {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-ide-panel border border-ide-border rounded-lg shadow-2xl overflow-hidden">
        {/* Header - Tab bar style */}
        <div className="h-10 bg-ide-bg border-b border-ide-border flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary">person</span>
            <span className="text-[#cccccc] text-sm font-display">Edit Profile</span>
          </div>
          <button 
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-[#858585] hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        
        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-[11px] text-[#bbbbbb] uppercase tracking-wide mb-2 font-display">
              Display Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className={`w-full px-3 py-2.5 bg-ide-bg border rounded text-white text-sm font-mono placeholder-[#858585] focus:outline-none focus:border-primary transition-colors ${
                errors.name ? 'border-red-500' : 'border-ide-border'
              }`}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          
          {/* Bio Field */}
          <div>
            <label className="block text-[11px] text-[#bbbbbb] uppercase tracking-wide mb-2 font-display">
              Bio / Title
              <span className="text-[#858585] ml-2 normal-case">({bio.length}/255)</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Full-stack developer, Open source enthusiast..."
              rows={3}
              className={`w-full px-3 py-2.5 bg-ide-bg border rounded text-white text-sm font-mono placeholder-[#858585] focus:outline-none focus:border-primary transition-colors resize-none ${
                errors.bio ? 'border-red-500' : 'border-ide-border'
              }`}
              disabled={isSubmitting}
            />
            {errors.bio && (
              <p className="text-red-400 text-xs mt-1">{errors.bio}</p>
            )}
          </div>
          
          {/* Current Role Display */}
          <div className="bg-ide-bg border border-ide-border rounded p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-[16px] text-syntax-blue">badge</span>
                <span className="text-[#cccccc]">Current Role:</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                user.role === 'FRONTEND' 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                  : user.role === 'BACKEND'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
              }`}>
                {user.role || 'Not Selected'}
              </span>
            </div>
            <p className="text-[10px] text-[#858585] mt-2">
              Role can be changed from the Role Selection screen.
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#cccccc] hover:text-white border border-ide-border hover:border-[#cccccc] rounded transition-colors"
              disabled={isSubmitting}
            >
              Cancel
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
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
