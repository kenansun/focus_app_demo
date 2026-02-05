import { db } from '../db/db';
import { v4 as uuidv4 } from 'uuid';
import { TaskEntity } from '../db/types';
import { ProfileService } from './profileService';

export const TaskService = {
  /**
   * Get all active tasks.
   */
  async getActiveTasks() {
    return await db.tasks.where('status').equals('active').toArray();
  },

  /**
   * Get all tasks (including completed/abandoned).
   */
  async getAllTasks() {
    return await db.tasks.toArray();
  },

  /**
   * Create a new task.
   */
  async createTask(title: string, targetMinutes: number, rewardOnComplete: number = 0): Promise<TaskEntity> {
    const newTask: TaskEntity = {
      id: uuidv4(),
      title,
      targetMinutes,
      accumulatedMinutes: 0,
      rewardOnComplete,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await db.tasks.add(newTask);
    return newTask;
  },

  /**
   * Add progress to a task.
   * Automatically completes the task if target is reached.
   */
  async addProgress(taskId: string, minutes: number) {
    const task = await db.tasks.get(taskId);
    if (!task) return;

    const newAccumulated = task.accumulatedMinutes + minutes;
    const isCompleted = newAccumulated >= task.targetMinutes;

    await db.tasks.update(taskId, {
      accumulatedMinutes: newAccumulated,
      status: isCompleted ? 'completed' : task.status,
      updatedAt: new Date().toISOString()
    });

    if (isCompleted && (task.rewardOnComplete || 0) > 0) {
      await ProfileService.updateBalance(task.rewardOnComplete!);
    }
  },

  /**
   * Manually update task status (e.g., abandon or complete early).
   */
  async updateStatus(taskId: string, status: 'active' | 'completed' | 'abandoned') {
    await db.tasks.update(taskId, {
      status,
      updatedAt: new Date().toISOString()
    });
  },

  /**
   * Delete a task.
   */
  async deleteTask(taskId: string) {
    await db.tasks.delete(taskId);
  }
};
