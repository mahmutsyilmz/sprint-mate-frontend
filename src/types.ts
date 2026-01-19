// API Response Types - matching backend DTOs

export interface User {
  id: string;
  githubUrl: string;
  name: string;
  surname: string | null;
  role: 'FRONTEND' | 'BACKEND' | null;
  bio: string | null;
  skills: string[];
}

/**
 * Active match info returned from /api/users/me/status
 */
export interface ActiveMatchInfo {
  matchId: string;
  communicationLink: string;
  partnerName: string;
  partnerRole: string;
  partnerSkills: string[];
  projectTitle: string;
  projectDescription: string;
}

/**
 * Complete user status including active match.
 * Used on login/refresh to restore user state.
 */
export interface UserStatus extends User {
  hasActiveMatch: boolean;
  activeMatch: ActiveMatchInfo | null;
}

export interface UserUpdateRequest {
  name: string;
  bio?: string | null;
  role?: 'FRONTEND' | 'BACKEND' | null;
  skills?: string[];
}

export interface MatchStatus {
  status: 'MATCHED' | 'WAITING';
  matchId: string | null;
  meetingUrl: string | null;
  partnerName: string | null;
  partnerRole: string | null;
  partnerSkills: string[] | null;
  projectTitle: string | null;
  projectDescription: string | null;
  waitingSince: string | null;
  queuePosition: number | null;
}

export interface MatchCompletion {
  matchId: string;
  status: string;
  completedAt: string;
  repositoryUrl: string | null;
}

export type Role = 'FRONTEND' | 'BACKEND';
