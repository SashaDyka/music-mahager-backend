import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';


const router = Router();

router.get('/users');
router.post('/users');


export { router as userRoutes };