// API Response Types - matching backend DTOs

export interface UserPreference {
  difficultyPreference: number | null;
  preferredThemeCodes: string[];
  preferredThemeNames: string[];
  learningGoals: string | null;
}

export interface ProjectTheme {
  code: string;
  displayName: string;
}

export interface User {
  id: string;
  githubUrl: string;
  name: string;
  surname: string | null;
  role: 'FRONTEND' | 'BACKEND' | null;
  bio: string | null;
  skills: string[];
  preference: UserPreference | null;
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

export interface UserPreferenceRequest {
  difficultyPreference: number | null;
  preferredThemeCodes: string[];
  learningGoals: string | null;
}

export interface UserUpdateRequest {
  name: string;
  bio?: string | null;
  role?: 'FRONTEND' | 'BACKEND' | null;
  skills?: string[];
  preference?: UserPreferenceRequest | null;
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
  repoUrl: string | null;
  reviewScore: number | null;
  reviewFeedback: string | null;
  reviewStrengths: string[] | null;
  reviewMissingElements: string[] | null;
}

export type Role = 'FRONTEND' | 'BACKEND';

/**
 * Chat message received from WebSocket or REST history endpoint.
 */
export interface ChatMessage {
  id: string;
  matchId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

/**
 * Chat message request for sending via WebSocket.
 */
export interface ChatMessageRequest {
  matchId: string;
  content: string;
}
