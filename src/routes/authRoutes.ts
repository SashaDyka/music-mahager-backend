import express from 'express';
import prisma from '../prismaClient.js';
import bcrypt from 'bcrypt'; 
import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';


const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.getProfile);


export { router as authRoutes };