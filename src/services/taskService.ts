import { TaskDataLayer } from '../data/tasks';
import { CreateTaskRequest, UpdateTaskRequest, CreateChecklistItemRequest, UpdateChecklistItemRequest } from '../types';

export class TaskService {
  private taskDataLayer: TaskDataLayer;

  constructor() {
    this.taskDataLayer = new TaskDataLayer();
  }

  async createTask(userId: string, request: CreateTaskRequest) {
    return await this.taskDataLayer.createTask(
      userId,
      request.title,
      request.description,
      request.position
    );
  }

  async getTasksByUserId(userId: string) {
    return await this.taskDataLayer.getTasksByUserId(userId);
  }

  async getTaskById(id: string) {
    return await this.taskDataLayer.getTaskById(id);
  }

  async updateTask(id: string, request: UpdateTaskRequest) {
    return await this.taskDataLayer.updateTask(id, request);
  }

  async deleteTask(id: string) {
    return await this.taskDataLayer.deleteTask(id);
  }

  async addChecklistItem(taskId: string, request: CreateChecklistItemRequest) {
    return await this.taskDataLayer.addChecklistItem(taskId, request.text);
  }

  async updateChecklistItem(taskId: string, itemId: string, request: UpdateChecklistItemRequest) {
    return await this.taskDataLayer.updateChecklistItem(taskId, itemId, request);
  }

  async deleteChecklistItem(taskId: string, itemId: string) {
    return await this.taskDataLayer.deleteChecklistItem(taskId, itemId);
  }
}
