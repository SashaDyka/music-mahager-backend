import { Router } from 'express';
import * as songsController from '../controllers/songController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import type { authRoutes } from './authRoutes.js';

const router = Router();

router.get('/songs', requireAuth, songsController.getSongs); 
router.post('/songs', requireAuth, upload.single('audioFile'), songsController.createSong);
router.get('/songs/:id', requireAuth, songsController.getSongDetails);
router.patch('/songs/:id', requireAuth, songsController.updateSong);
router.delete('/songs/:id', requireAuth, songsController.deleteSong);

export { router as songRoutes };