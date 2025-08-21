import express from 'express';
import prisma from '../db.js';

const router = express.Router();



router.get('/artists', async (req, res) => {
  try {
    const artists = await prisma.artist.findMany({
      include: {
        albums: { include: { tracks: true } },
        tracks: true,
      },
    });
    res.json(artists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch artists' });
  }
});



router.get('/artists/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const artist = await prisma.artist.findUnique({
      where: { id },
      include: { albums: true, tracks: true },
    });
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }
    res.json(artist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch artist' });
  }
});



router.post('/artists', async (req, res) => {
  const { name } = req.body;
  try {
    const newArtist = await prisma.artist.create({
      data: { name },
    });
    res.status(201).json(newArtist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create artist' });
  }
});

export default router;