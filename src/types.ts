// API Response Types - matching backend DTOs

export interface User {
  id: string;
  githubUrl: string;
  name: string;
  surname: string | null;
  role: 'FRONTEND' | 'BACKEND' | null;
  bio: string | null;
}

export interface UserUpdateRequest {
  name: string;
  bio?: string | null;
  role?: 'FRONTEND' | 'BACKEND' | null;
}

export interface MatchStatus {
  status: 'MATCHED' | 'WAITING';
  matchId: string | null;
  meetingUrl: string | null;
  partnerName: string | null;
  partnerRole: string | null;
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
