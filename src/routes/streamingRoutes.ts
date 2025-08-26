import { Router } from 'express';
import * as streamingController from '../controllers/streamingController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/rooms', requireAuth, streamingController.createRoom);
router.get('/rooms/:roomId', streamingController.getRoomStatus);

export { router as streamingRoutes };