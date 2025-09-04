import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { SongService } from "../services/songService.js";


const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
    };
}

const songService = new SongService();

export const getSongs = async (req: Request, res: Response) => {
  try {
    const songs = await songService.getSongs();
    res.json(songs);
  } catch (error) {
    console.error("Error fetching songs:", error);
    res.status(500).json({ message: "Failed to fetch songs." });
  }
};




export const createSong = async (req: AuthenticatedRequest, res: Response) => {
    const { title, artist } = req.body;
    const audioFile = req.file;
    const ownerId = req.user?.userId;

    if (!title || !audioFile || !ownerId) {
        return res.status(400).json({ error: 'Missing required fields or file.' });
    }

    try {
        const newSong = await prisma.song.create({
            data: {
                title: "qwerty",
                durationSec: 123,
                sourceType: "LOCAL",
                audioUrl: `/uploads/${audioFile.filename}`, 
                owner: {
                    connect: { id: ownerId } 
                }, 
            },
        });
        res.status(201).json(newSong);
    } catch (error) {
        console.error("Error creating song:", error);
        res.status(500).json({ error: 'Failed to create song.' });
    }
};

export const getSongDetails = async (req: Request, res: Response) => {
    if (!req.params.id) {
        return res.status(400).json({ error: 'Song ID is required.' });
    }
    const songId = parseInt(req.params.id, 10);

    if (isNaN(songId)) {
        return res.status(400).json({ error: 'Invalid song ID.' });
    }

    try {
        const song = await prisma.song.findUnique({
            where: { id: songId },
        });

        if (!song) {
            return res.status(404).json({ error: 'Song not found.' });
        }
        res.status(200).json(song);
    } catch (error) {
        console.error("Error fetching song details:", error);
        res.status(500).json({ error: 'Failed to fetch song details.' });
    }
};

export const updateSong = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.params.id) {
        return res.status(400).json({ error: 'Song ID is required.' });
    }
    const songId = parseInt(req.params.id, 10);
    const { title, artist } = req.body;
    const audioFile = req.file as Express.Multer.File;
    const ownerId = req.user?.userId;

    if (isNaN(songId) || !ownerId) {
        return res.status(400).json({ error: 'Invalid song ID or owner.' });
    }
    
    const audioUrl = audioFile ? `/uploads/${audioFile.filename}` : undefined;

    try {
        const updatedSong = await prisma.song.update({
            where: { id: songId, ownerId: ownerId },
            data: { title, artist, audioUrl},
        });
        res.status(200).json(updatedSong);
    } catch (error) {
        console.error("Error updating song:", error);
        res.status(500).json({ error: 'Failed to update song.' });
    }
};

export const deleteSong = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.params.id) {
        return res.status(400).json({ error: 'Song ID is required.' });
    }
    const songId = parseInt(req.params.id, 10);
    const ownerId = req.user?.userId;

    if (isNaN(songId) || !ownerId) {
        return res.status(400).json({ error: 'Invalid song ID or owner.' });
    }
    
    try {
        await prisma.song.delete({
            where: { id: songId, ownerId: ownerId },
        });
        res.status(200).json({ message: 'Song deleted successfully.' });
    } catch (error) {
        console.error("Error deleting song:", error);
        res.status(500).json({ error: 'Failed to delete song.' });
    }
};