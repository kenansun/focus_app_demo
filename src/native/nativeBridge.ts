import { Capacitor, registerPlugin } from '@capacitor/core';

export type TimerMode = 'focus' | 'play' | 'task';

const isNative = Capacitor.isNativePlatform();

interface FocusTimerPlugin {
  startTimer(options: { mode: TimerMode; taskId?: string; targetMinutes?: number; startTime?: string }): Promise<void>;
  stopTimer(): Promise<void>;
  minimizeApp(): Promise<void>;
  addListener(eventName: 'tick' | 'finish', listenerFunc: (data: any) => void): Promise<{ remove: () => void }>;
  requestOverlayPermission(): Promise<void>;
  requestUsageAccess(): Promise<void>;
  requestAccessibilityService(): Promise<void>;
}

const FocusTimer = registerPlugin<FocusTimerPlugin>('FocusTimer');

export const nativeBridge = {
  async startTimer(mode: TimerMode, payload: Record<string, any> = {}) {
    if (!isNative) return;
    await FocusTimer.startTimer({ mode, taskId: payload.taskId, targetMinutes: payload.targetMinutes, startTime: payload.startTime });
  },
  async stopTimer() {
    if (!isNative) return;
    await FocusTimer.stopTimer();
  },
  async minimizeApp() {
    if (!isNative) return;
    await FocusTimer.minimizeApp();
  },
  async requestOverlayPermission() {
    if (!isNative) return;
    await FocusTimer.requestOverlayPermission();
  },
  async requestUsageAccess() {
    if (!isNative) return;
    await FocusTimer.requestUsageAccess();
  },
  async requestAccessibilityService() {
    if (!isNative) return;
    await FocusTimer.requestAccessibilityService();
  },
  onTick(cb: (data: { mode: TimerMode; deltaMs: number }) => void) {
    if (!isNative) return { remove: () => {} };
    return FocusTimer.addListener('tick', cb as any);
  },
  onFinish(cb: (data: { mode: TimerMode }) => void) {
    if (!isNative) return { remove: () => {} };
    return FocusTimer.addListener('finish', cb as any);
  }
};
