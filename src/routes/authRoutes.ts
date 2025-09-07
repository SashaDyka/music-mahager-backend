 import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { AuthService } from '../services/authService.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { prisma } from '../prismaClient.js';


const router = Router();

const authService = new AuthService(prisma);
const authController = new AuthController(authService);

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));
router.get('/me', requireAuth, (req, res) => authController.getMe(req, res));

export { router as authRoutes };