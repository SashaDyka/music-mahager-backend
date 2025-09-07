import { Router } from 'express';
import { PlaylistsController } from '../controllers/playlistsController.js';
import { PlaylistService } from '../services/playlistService.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { prisma } from '../prismaClient.js';


const router = Router();
const playlistsService = new PlaylistService(prisma);
const playlistsController = new PlaylistsController(playlistsService);


router.get('/', requireAuth, (req, res) => playlistsController.getPlaylists(req, res));
router.post('/', requireAuth, (req, res) => playlistsController.createPlaylist(req, res));
router.get('/:id', requireAuth, (req, res) => playlistsController.getPlaylistDetails(req, res));
router.patch('/:id', requireAuth, (req, res) => playlistsController.updatePlaylist(req, res));
router.delete('/:id', requireAuth, (req, res) => playlistsController.deletePlaylist(req, res));
router.post('/:id/songs', requireAuth, (req, res) => playlistsController.addSongToPlaylist(req, res));
router.delete('/:id/songs/:songId', requireAuth, (req, res) => playlistsController.removeSongFromPlaylist(req, res));


export { router as playlistsRoutes };