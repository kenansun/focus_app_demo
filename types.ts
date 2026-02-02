export interface AppItem {
  id: string;
  name: string;
  icon: string;
  category: string;
  isAdded: boolean;
}

export interface Task {
  id: string;
  title: string;
  targetMinutes: number;
  accumulatedMinutes: number;
  status: 'active' | 'completed' | 'failed';
  date?: string;
  reward?: string;
  isHistory?: boolean;
}

export interface Group {
  id: string;
  name: string;
  appCount: number;
  icon: string;
  color: string;
}

export enum PermissionStatus {
  Granted = 'granted',
  Denied = 'denied',
  Pending = 'pending'
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: PermissionStatus;
}
