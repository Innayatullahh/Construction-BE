import { UserDataLayer } from '../data/users';
import { CreateUserRequest } from '../types';

export class UserService {
  private userDataLayer: UserDataLayer;

  constructor() {
    this.userDataLayer = new UserDataLayer();
  }

  async createOrGetUser(request: CreateUserRequest): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userDataLayer.findUserByName(request.name);
    if (existingUser) {
      return existingUser;
    }

    // Create new user
    return await this.userDataLayer.createUser(request.name);
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userDataLayer.getUserById(id);
  }
}
