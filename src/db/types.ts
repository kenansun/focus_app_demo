import { PermissionStatus } from '../../types';

/**
 * Focus Session Entity
 * Records a completed or attempted focus session.
 */
export interface FocusSession {
  id: string; // UUID
  startTime: string; // ISO Date String
  endTime: string; // ISO Date String
  durationMinutes: number; // Actual time spent
  mode: 'focus' | 'play' | 'task';
  status: 'completed' | 'abandoned';
  rewardChange: number; // + for focus, - for play
  taskId?: string; // Optional link to a task
}

/**
 * Task Entity
 * User-created goals to track progress.
 */
export interface TaskEntity {
  id: string; // UUID
  title: string;
  targetMinutes: number;
  accumulatedMinutes: number;
  rewardOnComplete?: number;
  status: 'active' | 'completed' | 'abandoned';
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
}

/**
 * App Group Entity
 * Configuration for app blocking whitelists/blacklists.
 */
export interface AppGroup {
  id: string; // UUID
  name: string;
  icon: string;
  color: string;
  packageNames: string[]; // List of app identifiers
}

/**
 * User Profile Entity
 * Singleton record for user stats and info.
 * We use a fixed ID 'current-user' for the single local user.
 */
export interface UserProfile {
  id: string; // 'current-user'
  username: string;
  avatar: string;
  rewardBalance: number; // Current available minutes
  totalFocusTime: number; // Lifetime minutes
  streakDays: number; // Calculated streak
  lastActiveDate: string; // To help calculate streak
}

/**
 * App Settings Entity
 * Global configuration.
 * Fixed ID 'global-settings'.
 */
export interface AppSettings {
  id: string; // 'global-settings'
  focusDuration: number; // e.g., 25
  rewardDuration: number; // e.g., 5
  usageThreshold: number; // e.g., 120
  restDuration: number; // e.g., 20 (seconds)
  dailyGoalMinutes: number; // e.g., 240 (4 hours)
  permissions: {
    accessibility: PermissionStatus;
    overlay: PermissionStatus;
    usage: PermissionStatus;
    admin: PermissionStatus;
  };
}
