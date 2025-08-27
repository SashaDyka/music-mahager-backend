import { Router } from 'express';
import * as playlistsController from '../controllers/playlistsController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/playlists', requireAuth, playlistsController.getPlaylists);
router.post('/playlists', requireAuth, playlistsController.createPlaylist);
router.get('/playlists/:id', requireAuth, playlistsController.getPlaylistDetails);
router.patch('/playlists/:id', requireAuth, playlistsController.updatePlaylist);
router.delete('/playlists/:id', requireAuth, playlistsController.deletePlaylist);
router.post('/playlists/:id/songs', requireAuth, playlistsController.addSongToPlaylist);
router.delete('/playlists/:id/songs/:songId', requireAuth, playlistsController.removeSongFromPlaylist);

export { router as playlistsRoutes };