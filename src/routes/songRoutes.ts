import { Router } from 'express';
import * as songsController from '../controllers/songController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import type { authRoutes } from './authRoutes.js';

const router = Router();

router.get('/', requireAuth, songsController.getSongs); 
router.post('/', requireAuth, upload.single('audioFile'), songsController.createSong);
router.get('/:id', requireAuth, songsController.getSongDetails);
router.patch('/:id', requireAuth, songsController.updateSong);
router.delete('/:id', requireAuth, songsController.deleteSong);

export { router as songRoutes };