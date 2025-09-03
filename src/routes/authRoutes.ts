 import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';


const router = Router();

router.post('/register', authController.register);
router.post('/login ', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.getProfile);

router.get('/me', requireAuth, (req, res) => {
    res.json({ message: 'This is a protected route', user: 'user_info_here' });
})

export { router as authRoutes };