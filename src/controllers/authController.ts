import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';
import { z } from 'zod';

import { AuthService } from '../services/authService.js';
import { RegisterDto, LoginDto } from '../dto/authDTO.js';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async register(req: Request, res: Response) {
    try {
      const dto = new RegisterDto(req.body.email, req.body.password, req.body.displayName);
      const user = await this.authService.register(dto);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: 'Registration failed.' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const dto = new LoginDto(req.body.email, req.body.password);
      const { user, token } = await this.authService.login(dto);

      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      res.status(200).json({ user });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
  }

  async getMe(req: Request, res: Response) {
    try {
      const { userId } = (req as any).user;
      const user = await this.authService.getProfile(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}