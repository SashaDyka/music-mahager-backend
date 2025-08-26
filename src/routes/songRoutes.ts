import { Router } from 'express';
import * as songsController from '../controllers/songController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import type { authRoutes } from './authRoutes.js';

const router = Router();

router.get('/songs', requireAuth, songsController.getSongs); //дописать route ''
router.post('/', requireAuth, songsController.createSong);
router.get('/:id', requireAuth, songsController.getSongDetails);
router.patch('/:id', requireAuth, songsController.updateSong);
router.delete('/:id', requireAuth, songsController.deleteSong);

export { router as songRoutes };