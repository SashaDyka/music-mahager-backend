import { Router } from 'express';
import { SongController } from '../controllers/songController.js';
import { SongService } from '../services/songService.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { uploadAudio } from '../middleware/uploadMiddleware.js';
import { prisma } from '../prismaClient.js';

const router = Router();

const songService = new SongService(prisma);
const songController = new SongController(songService);

router.get('/', requireAuth, (req, res) => songController.getSongs(req, res));
router.post('/', requireAuth, uploadAudio.single('audioFile'), (req, res) => songController.createSong(req, res));
router.get('/:id', requireAuth, (req, res) => songController.getSongById(req, res));
router.patch('/:id', requireAuth, (req, res) => songController.updateSong(req, res));
router.delete('/:id', requireAuth, (req, res) => songController.deleteSong(req, res));

export { router as songRoutes };
