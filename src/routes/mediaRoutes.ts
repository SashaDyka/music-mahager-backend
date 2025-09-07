import { Router } from 'express';
import multer from 'multer';
import { MediaController } from '../controllers/mediaController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { MediaService } from '../services/mediaService.js';
import { prisma } from '../prismaClient.js';

const router = Router();
const mediaService = new MediaService(prisma);
const mediaController = new MediaController(mediaService);

const upload = multer({ dest: 'uploads/' });

router.post('/upload', requireAuth, upload.single('audioFile'), 
  (req, res) => mediaController.uploadFile(req, res)
);

router.get('/file/:id',
  (req, res) => mediaController.getFile(req, res)
);

export { router as mediaRoutes };
