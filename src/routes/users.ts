import { Router } from 'express';
import { UserService } from '../services/userService';
import { CreateUserRequest } from '../types';

const router = Router();
const userService = new UserService();

// Create or get user by name
router.post('/', async (req, res) => {
  try {
    const request: CreateUserRequest = req.body;
    
    if (!request.name || request.name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }

    const user = await userService.createOrGetUser(request);
    res.json(user);
  } catch (error) {
    console.error('Error creating/getting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
