import { Router } from 'express';
import * as songsController from '../controllers/songController.js';
import { uploadAudio } from '../middleware/uploadMiddleware.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import type { authRoutes } from './authRoutes.js';

const router = Router();

router.get('/', requireAuth, songController.getSongs); 
router.post('/', requireAuth, upload.single('audioFile'), songsController.createSong);
router.get('/:id', requireAuth, songsController.getSongDetails);
router.patch('/:id', requireAuth, songsController.updateSong);
router.delete('/:id', requireAuth, songsController.deleteSong);

export { router as songRoutes };