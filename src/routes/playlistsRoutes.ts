import { Router } from 'express';
import * as playlistsController from '../controllers/playlistsController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/playlists', requireAuth, playlistsController.getPlaylists);
router.post('/', requireAuth, playlistsController.createPlaylist);
router.get('/:id', requireAuth, playlistsController.getPlaylistDetails);
router.patch('/:id', requireAuth, playlistsController.updatePlaylist);
router.delete('/:id', requireAuth, playlistsController.deletePlaylist);
router.post('/:id/songs', requireAuth, playlistsController.addSongToPlaylist);
router.delete('/:id/songs/:songId', requireAuth, playlistsController.removeSongFromPlaylist);

export { router as playlistsRoutes };