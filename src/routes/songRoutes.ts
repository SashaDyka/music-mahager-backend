import { Router } from 'express';
import { songController } from '../controllers/songController.js';
import { uploadAudio } from '../middleware/uploadMiddleware.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', requireAuth, songController.getSongs); 
router.post('/', requireAuth, uploadAudio('audioFile'), songsController.createSong);
router.get('/:id', requireAuth, songController.getSongById);
router.patch('/:id', requireAuth, songController.updateSong);
router.delete('/:id', requireAuth, songController.deleteSong);

export { router as songRoutes };