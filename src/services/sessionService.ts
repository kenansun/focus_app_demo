import { db } from '../db/db';
import { v4 as uuidv4 } from 'uuid';
import { FocusSession } from '../db/types';
import { ProfileService } from './profileService';
import { TaskService } from './taskService';
import { isToday, isYesterday, parseISO } from 'date-fns';

export const SessionService = {
  /**
   * Record a completed session.
   * Handles all side effects: updating balance, task progress, and user stats.
   */
  async recordSession(sessionData: {
    mode: 'focus' | 'play' | 'task';
    durationMinutes: number;
    startTime: string;
    endTime: string;
    status: 'completed' | 'abandoned';
    taskId?: string;
  }) {
    const shouldSaveToHistory = sessionData.durationMinutes >= 5;

    // 1. Calculate Reward Change
    let rewardChange = 0;
    
    if (sessionData.mode === 'play') {
        // Spend rewards: 1 minute play = 1 minute cost
        rewardChange = -sessionData.durationMinutes;
    } else {
        if (!shouldSaveToHistory) {
          rewardChange = 0;
        } else {
        // Earn rewards: Get settings to calculate ratio
        const settings = await db.settings.get('global-settings');
        const focusRule = settings?.focusDuration || 25;
        const rewardRule = settings?.rewardDuration || 5;
        
        // Example: 25m focus -> 5m reward
        // Ratio = 5 / 25 = 0.2
        const ratio = rewardRule / focusRule;
        rewardChange = Math.floor(sessionData.durationMinutes * ratio);
        }
    }

    // 2. Create Session Record
    const newSession: FocusSession = {
        id: uuidv4(),
        ...sessionData,
        rewardChange
    };
    if (shouldSaveToHistory) {
      await db.sessions.add(newSession);
    }

    // 3. Update User Profile (Balance & Total Time)
    if (rewardChange !== 0) {
        await ProfileService.updateBalance(rewardChange);
    }
    if (shouldSaveToHistory && sessionData.mode !== 'play') {
        await ProfileService.addFocusTime(sessionData.durationMinutes);
        await this.updateStreak();
    }

    // 4. Update Task Progress (if applicable)
    if (shouldSaveToHistory && sessionData.taskId && sessionData.mode === 'task') {
        await TaskService.addProgress(sessionData.taskId, sessionData.durationMinutes);
    }

    return newSession;
  },

  /**
   * Update User Streak Logic
   */
  async updateStreak() {
      const profile = await ProfileService.getProfile();
      const lastActive = parseISO(profile.lastActiveDate);
      const today = new Date();

      if (isToday(lastActive)) {
          // Already active today, do nothing
          return;
      }

      let newStreak = profile.streakDays;
      if (isYesterday(lastActive)) {
          // Continue streak
          newStreak += 1;
      } else {
          // Broken streak, reset to 1 (today is day 1)
          // Wait, if lastActive was older than yesterday, streak is broken.
          // But if we are running this, it means we just finished a session TODAY.
          // So the streak becomes 1.
          newStreak = 1;
      }

      await db.profile.update('current-user', {
          streakDays: newStreak,
          lastActiveDate: today.toISOString()
      });
  },

  /**
   * Get sessions for a specific date range.
   */
  async getHistory(startDate: Date, endDate: Date) {
    return await db.sessions
      .where('startTime')
      .between(startDate.toISOString(), endDate.toISOString())
      .reverse() // Newest first
      .toArray();
  },

  /**
   * Get total focus time for today (in minutes).
   */
  async getTodayFocusMinutes() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const todaySessions = await db.sessions
      .where('startTime')
      .aboveOrEqual(startOfDay.toISOString())
      .filter(s => s.mode !== 'play')
      .toArray();

    return todaySessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  },

  async getRecentTaskSessions(limit: number = 2) {
    return await db.sessions
      .orderBy('startTime')
      .reverse()
      .filter(s => s.mode === 'task')
      .limit(limit)
      .toArray();
  }
};
