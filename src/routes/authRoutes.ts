 import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';


const router = Router();

router.post('/auth/register', authController.register);
router.post('/auth/login ', authController.login);
router.post('/auth/logout', authController.logout);
router.get('/auth/me', authController.getProfile);

router.get('/auth/me', requireAuth, (req, res) => {
    // In a real project req.user 
    res.json({ message: 'This is a protected route', user: 'user_info_here' });
})

export { router as authRoutes };