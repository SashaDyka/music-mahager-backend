import express from 'express';
import prisma from '../db.js';

const router = express.Router();



router.get('/tracks', async (req, res) => {
  try {
    const tracks = await prisma.track.findMany({
      include: { album: true, artist: true },
    });
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tracks' });
  }
});



router.get('/tracks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const track = await prisma.track.findUnique({
      where: { id },
      include: { album: true, artist: true },
    });
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    res.json(track);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch track' });
  }
});



router.post('/tracks', async (req, res) => {
  const { title, durationSec, audioUrl, albumId, artistId } = req.body;
  try {
    const newTrack = await prisma.track.create({
      data: {
        title,
        durationSec,
        audioUrl,
        albumId,
        artistId,
      },
    });
    res.status(201).json(newTrack);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create track' });
  }
});



router.get('/albums', async (req, res) => {
  try {
    const albums = await prisma.album.findMany({
      include: { artist: true, tracks: true },
    });
    res.json(albums);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch albums' });
  }
});



router.post('/albums', async (req, res) => {
  const { title, artistId, year, coverUrl } = req.body;
  try {
    const newAlbum = await prisma.album.create({
      data: {
        title,
        artistId,
        year,
        coverUrl,
      },
    });
    res.status(201).json(newAlbum);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create album' });
  }
});

export default router;