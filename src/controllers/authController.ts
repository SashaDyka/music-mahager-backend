import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';
import { z } from 'zod';

const secret = process.env.JWT_SECRET as string;

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    //  password is not hashing!
    const user = await prisma.user.create({
      data: { email, password },
    });

    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });
    res.cookie('jwt', token, { httpOnly: true });

    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid data provided.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });
    res.cookie('jwt', token, { httpOnly: true });

    return res.status(200).json({ message: 'Logged in successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.' });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('jwt');
  res.status(200).json({ message: 'Logged out successfully.' });
};

export const getProfile = async (req: Request, res: Response) => {
  // @ts-ignore
  const { userId } = req.user;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true },
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  return res.status(200).json(user);
};