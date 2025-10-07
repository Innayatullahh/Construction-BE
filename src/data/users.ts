import { User } from '../types';

// In-memory storage for demo purposes
// In production, this would be a proper database
const users: Map<string, User> = new Map();

export class UserDataLayer {
  async createUser(name: string): Promise<User> {
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user: User = {
      id,
      name,
      createdAt: new Date(),
    };
    
    users.set(id, user);
    return user;
  }

  async findUserByName(name: string): Promise<User | null> {
    for (const user of users.values()) {
      if (user.name === name) {
        return user;
      }
    }
    return null;
  }

  async getUserById(id: string): Promise<User | null> {
    return users.get(id) || null;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(users.values());
  }
}
