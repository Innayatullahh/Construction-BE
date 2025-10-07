import { Task, ChecklistItem, TaskStatus, ChecklistStatus } from '../types';

// In-memory storage for demo purposes
const tasks: Map<string, Task> = new Map();

export class TaskDataLayer {
  async createTask(userId: string, title: string, description?: string, position?: { x: number; y: number }): Promise<Task> {
    const id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const task: Task = {
      id,
      userId,
      title,
      description,
      status: 'not-started',
      position,
      checklist: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    tasks.set(id, task);
    return task;
  }

  async getTasksByUserId(userId: string): Promise<Task[]> {
    return Array.from(tasks.values()).filter(task => task.userId === userId);
  }

  async getTaskById(id: string): Promise<Task | null> {
    return tasks.get(id) || null;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    const task = tasks.get(id);
    if (!task) return null;

    const updatedTask = {
      ...task,
      ...updates,
      updatedAt: new Date(),
    };
    
    tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    return tasks.delete(id);
  }

  async addChecklistItem(taskId: string, text: string): Promise<ChecklistItem | null> {
    const task = tasks.get(taskId);
    if (!task) return null;

    const checklistItem: ChecklistItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text,
      status: 'not-started',
      createdAt: new Date(),
    };

    task.checklist.push(checklistItem);
    task.updatedAt = new Date();
    tasks.set(taskId, task);
    
    return checklistItem;
  }

  async updateChecklistItem(taskId: string, itemId: string, updates: Partial<ChecklistItem>): Promise<ChecklistItem | null> {
    const task = tasks.get(taskId);
    if (!task) return null;

    const itemIndex = task.checklist.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return null;

    task.checklist[itemIndex] = {
      ...task.checklist[itemIndex],
      ...updates,
    };
    task.updatedAt = new Date();
    tasks.set(taskId, task);
    
    return task.checklist[itemIndex];
  }

  async deleteChecklistItem(taskId: string, itemId: string): Promise<boolean> {
    const task = tasks.get(taskId);
    if (!task) return false;

    const itemIndex = task.checklist.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return false;

    task.checklist.splice(itemIndex, 1);
    task.updatedAt = new Date();
    tasks.set(taskId, task);
    
    return true;
  }
}
