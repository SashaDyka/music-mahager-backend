import type { Request, Response } from 'express';
import { UserService } from '../services/userService.js';
import { UpdateUserDto } from '../dto/userDTO.js';

export class UserController {
  constructor(private readonly userService: UserService) {}

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve user data.' });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId } = req.user as any;

      if (id !== userId) {
        return res.status(403).json({ message: 'Forbidden. You can only update your own profile.' });
      }

      const dto = req.body as UpdateUserDto;
      const updatedUser = await this.userService.updateUser(userId, dto);
      
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update user profile.' });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId } = req.user as any;

      if (id !== userId) {
        return res.status(403).json({ message: 'Forbidden. You can only delete your own profile.' });
      }

      await this.userService.deleteUser(userId);
      res.status(204).send(); 
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete user account.' });
    }
  }
}