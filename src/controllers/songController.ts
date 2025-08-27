import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSongs = async (req: Request, res: Response) => {
    try {
        const songs = await prisma.song.findMany();
        res.status(200).json({ songs });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch songs.' });
    }
};

export const createSong = async (req: Request, res: Response) => {
    const { title, artist, audioUrl, sourceType } = req.body;
    const ownerId = (req as any).user.userId; 

    try {
        const newSong = await prisma.song.create({
            data: {
                title,
                artist,
                audioUrl,
                sourceType,
                ownerId,
            },
        });
        res.status(201).json(newSong);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create song.' });
    }
};

export const getSongDetails = async (req: Request, res: Response) => {
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
        res.status(500).json({ error: 'Failed to fetch song details.' });
    }
};

export const updateSong = async (req: Request, res: Response) => {
    const songId = parseInt(req.params.id, 10);
    const { title, artist, audioUrl, sourceType } = req.body;
    const ownerId = (req as any).user.userId;

    try {
        const updatedSong = await prisma.song.update({
            where: { id: songId },
            data: { title, artist, audioUrl, sourceType },
        });
        res.status(200).json(updatedSong);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update song.' });
    }
};


export const deleteSong = async (req: Request, res: Response) => {
    const songId = parseInt(req.params.id, 10);
    const ownerId = (req as any).user.userId;

    try {
        await prisma.song.delete({
            where: { id: songId },
        });
        res.status(200).json({ message: 'Song deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete song.' });
    }
};