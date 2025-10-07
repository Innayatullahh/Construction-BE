import { Router } from 'express';
import { TaskService } from '../services/taskService';
import { CreateTaskRequest, UpdateTaskRequest, CreateChecklistItemRequest, UpdateChecklistItemRequest } from '../types';

const router = Router();
const taskService = new TaskService();

// Get all tasks for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await taskService.getTasksByUserId(userId);
    res.json(tasks);
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get task by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await taskService.getTaskById(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Error getting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new task
router.post('/', async (req, res) => {
  try {
    const request: CreateTaskRequest = req.body;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    if (!request.title || request.title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const task = await taskService.createTask(userId, request);
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const request: UpdateTaskRequest = req.body;
    
    const task = await taskService.updateTask(id, request);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await taskService.deleteTask(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add checklist item to task
router.post('/:id/checklist', async (req, res) => {
  try {
    const { id } = req.params;
    const request: CreateChecklistItemRequest = req.body;
    
    if (!request.text || request.text.trim() === '') {
      return res.status(400).json({ error: 'Checklist item text is required' });
    }
    
    const item = await taskService.addChecklistItem(id, request);
    
    if (!item) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(201).json(item);
  } catch (error) {
    console.error('Error adding checklist item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update checklist item
router.put('/:id/checklist/:itemId', async (req, res) => {
  try {
    const { id, itemId } = req.params;
    const request: UpdateChecklistItemRequest = req.body;
    
    const item = await taskService.updateChecklistItem(id, itemId, request);
    
    if (!item) {
      return res.status(404).json({ error: 'Task or checklist item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error updating checklist item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete checklist item
router.delete('/:id/checklist/:itemId', async (req, res) => {
  try {
    const { id, itemId } = req.params;
    const deleted = await taskService.deleteChecklistItem(id, itemId);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Task or checklist item not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting checklist item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
