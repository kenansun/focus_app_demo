import { db } from '../db/db';
import { v4 as uuidv4 } from 'uuid';

export const ProfileService = {
  /**
   * Get the current user profile.
   * Initializes one if it doesn't exist (handled by DB populate, but failsafe here).
   */
  async getProfile() {
    let profile = await db.profile.get('current-user');
    if (!profile) {
        // Fallback re-init if DB was cleared manually
        await db.profile.add({
            id: 'current-user',
            username: 'Alex',
            avatar: 'default',
            rewardBalance: 0,
            totalFocusTime: 0,
            streakDays: 0,
            lastActiveDate: new Date().toISOString()
        });
        profile = await db.profile.get('current-user');
    }
    return profile!;
  },

  /**
   * Update reward balance.
   * @param amount Positive to add, negative to subtract.
   */
  async updateBalance(amount: number) {
    const profile = await this.getProfile();
    const newBalance = Math.max(0, profile.rewardBalance + amount);
    
    await db.profile.update('current-user', {
      rewardBalance: newBalance
    });
    
    return newBalance;
  },

  /**
   * Update total focus time.
   * @param minutes Minutes to add.
   */
  async addFocusTime(minutes: number) {
    const profile = await this.getProfile();
    await db.profile.update('current-user', {
      totalFocusTime: profile.totalFocusTime + minutes
    });
  },

  /**
   * Update user details (name, avatar).
   */
  async updateDetails(updates: { username?: string; avatar?: string }) {
    await db.profile.update('current-user', updates);
  }
};
