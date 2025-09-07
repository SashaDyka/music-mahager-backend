import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { UserService } from '../services/userService.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { prisma } from '../prismaClient.js';

const router = Router();

const userService = new UserService(prisma);
const userController = new UserController(userService);

router.get('/:id', (req, res) => userController.getUserById(req, res));
router.patch('/:id', requireAuth, (req, res) => userController.updateUser(req, res));
router.delete('/:id', requireAuth, (req, res) => userController.deleteUser(req, res));

export { router as userRoutes };