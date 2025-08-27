import { Router } from 'express';
import * as mediaController from '../controllers/mediaController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' }); // edit folder for saveing

const router = Router();

router.post('/media/upload', requireAuth, upload.single('audioFile'), mediaController.uploadFile);
router.get('/media/file/:id', mediaController.getFile);

export { router as mediaRoutes };