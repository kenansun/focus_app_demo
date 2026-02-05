import Dexie, { Table } from 'dexie';
import { FocusSession, TaskEntity, AppGroup, UserProfile, AppSettings } from './types';
import { PermissionStatus } from '../../types';

export class FocusDatabase extends Dexie {
  sessions!: Table<FocusSession, string>;
  tasks!: Table<TaskEntity, string>;
  groups!: Table<AppGroup, string>;
  profile!: Table<UserProfile, string>;
  settings!: Table<AppSettings, string>;

  constructor() {
    super('FocusDatabase');

    // Define schema
    // Note: We only index fields we intend to query by.
    this.version(1).stores({
      sessions: 'id, startTime, mode, status, taskId',
      tasks: 'id, status, createdAt',
      groups: 'id',
      profile: 'id', // Singleton
      settings: 'id' // Singleton
    });

    // Populate default data if needed
    this.on('populate', () => {
      this.populateDefaults();
    });
  }

  private async populateDefaults() {
    // Default User Profile
    await this.profile.add({
      id: 'current-user',
      username: 'Alex',
      avatar: 'default',
      rewardBalance: 0,
      totalFocusTime: 0,
      streakDays: 0,
      lastActiveDate: new Date().toISOString()
    });

    // Default Settings
    await this.settings.add({
      id: 'global-settings',
      focusDuration: 25,
      rewardDuration: 5,
      usageThreshold: 120,
      restDuration: 20,
      dailyGoalMinutes: 240, // Default 4 hours
      permissions: {
        accessibility: PermissionStatus.Pending,
        overlay: PermissionStatus.Pending,
        usage: PermissionStatus.Pending,
        admin: PermissionStatus.Pending
      }
    });

    // Default App Groups
    await this.groups.bulkAdd([
      { id: '1', name: 'Work', icon: 'work', color: 'text-primary', packageNames: [] },
      { id: '2', name: 'Social', icon: 'chat_bubble', color: 'text-purple-500', packageNames: [] },
      { id: '3', name: 'Games', icon: 'sports_esports', color: 'text-orange-500', packageNames: [] },
      { id: '4', name: 'Sleep', icon: 'bedtime', color: 'text-indigo-500', packageNames: [] },
      { id: '5', name: 'Creativity', icon: 'palette', color: 'text-pink-500', packageNames: [] },
    ]);
  }
}

export const db = new FocusDatabase();
