import { Router } from 'express';
import * as sharingController from '../controllers/sharingController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', requireAuth, sharingController.createShareLink);
router.post('/:shareId/revoke', requireAuth, sharingController.revokeShareLink);

router.get('/public/song/:shareId', sharingController.getPublicSong);
router.get('/public/playlist/:shareId', sharingController.getPublicPlaylist);

export { router as sharingRoutes };