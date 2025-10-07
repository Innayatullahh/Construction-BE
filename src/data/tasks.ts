import { Task, ChecklistItem, TaskStatus, ChecklistStatus } from '../types';
import fs from 'fs';
import path from 'path';

// File-based persistent storage
const DATA_FILE = path.join(__dirname, '../../data/tasks.json');

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load tasks from file or initialize empty Map
let tasks: Map<string, Task> = new Map();

// Load data from file
function loadTasks(): void {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      const tasksArray = JSON.parse(data);
      tasks = new Map(tasksArray.map((task: any) => [task.id, {
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        checklist: task.checklist.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt)
        }))
      }]));
    }
  } catch (error) {
    console.error('Error loading tasks:', error);
    tasks = new Map();
  }
}

// Save tasks to file
function saveTasks(): void {
  try {
    const tasksArray = Array.from(tasks.values());
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasksArray, null, 2));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
}

// Load tasks on startup
loadTasks();

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
    saveTasks();
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
    saveTasks();
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    const deleted = tasks.delete(id);
    if (deleted) {
      saveTasks();
    }
    return deleted;
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
    saveTasks();
    
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
    saveTasks();
    
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
    saveTasks();
    
    return true;
  }
}
