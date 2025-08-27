import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPlaylists = async (req: Request, res: Response) => {
    const ownerId = (req as any).user.userId;

    try {
        const playlists = await prisma.playlist.findMany({
            where: { ownerId },
            include: {
                songs: {
                    include: { song: true },
                    orderBy: { index: 'asc' },
                },
            },
        });
        res.status(200).json(playlists);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch playlists.' });
    }
};



export const createPlaylist = async (req: Request, res: Response) => {
    const { title } = req.body;
    const ownerId = (req as any).user.userId;

    try {
        const newPlaylist = await prisma.playlist.create({
            data: { title, ownerId },
        });
        res.status(201).json(newPlaylist);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create playlist.' });
    }
};



export const getPlaylistDetails = async (req: Request<{ id: string }>, res: Response) => {
    const playlistId = parseInt(req.params.id, 10);

    if (isNaN(playlistId)) {
        return res.status(400).json({ error: 'Invalid playlist ID.' });
    }

    try {
        const playlist = await prisma.playlist.findUnique({
            where: { id: playlistId },
            include: {
                songs: {
                    include: { song: true },
                    orderBy: { index: 'asc' },
                },
            },
        });

        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found.' });
        }

        res.status(200).json(playlist);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch playlist details.' });
    }
};



export const updatePlaylist = async (req: Request<{ id: string }>, res: Response) => {
    const playlistId = parseInt(req.params.id, 10);
    const { title } = req.body;

    if (isNaN(playlistId)) {
        return res.status(400).json({ error: 'Invalid playlist ID.' });
    }
    
    try {
        const updatedPlaylist = await prisma.playlist.update({
            where: { id: playlistId },
            data: { title },
        });
        res.status(200).json(updatedPlaylist);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update playlist.' });
    }
};



export const deletePlaylist = async (req: Request<{ id: string }>, res: Response) => {
    const playlistId = parseInt(req.params.id, 10);

    if (isNaN(playlistId)) {
        return res.status(400).json({ error: 'Invalid playlist ID.' });
    }
    
    try {
        await prisma.playlistSong.deleteMany({
            where: { playlistId },
        });

        await prisma.playlist.delete({
            where: { id: playlistId },
        });

        res.status(200).json({ message: 'Playlist deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete playlist.' });
    }
};



export const addSongToPlaylist = async (req: Request<{ id: string }>, res: Response) => {
    const playlistId = parseInt(req.params.id, 10);
    const { songId } = req.body;

    if (isNaN(playlistId)) {
        return res.status(400).json({ error: 'Invalid playlist ID.' });
    }

    try {
        const songsCount = await prisma.playlistSong.count({ where: { playlistId } });
        
        const newPlaylistSong = await prisma.playlistSong.create({
            data: {
                playlistId,
                songId,
                index: songsCount, 
            },
        });
        res.status(201).json(newPlaylistSong);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add song to playlist.' });
    }
};



export const removeSongFromPlaylist = async (req: Request<{ id: string, songId: string }>, res: Response) => {
    const playlistId = parseInt(req.params.id, 10);
    const songId = parseInt(req.params.songId, 10);

    if (isNaN(playlistId) || isNaN(songId)) {
        return res.status(400).json({ error: 'Invalid ID provided.' });
    }

    try {
        const songToRemove = await prisma.playlistSong.findFirst({
            where: { playlistId, songId },
            select: { index: true },
        });

        if (!songToRemove) {
            return res.status(404).json({ error: 'Song not found in playlist.' });
        }

        await prisma.playlistSong.deleteMany({
            where: { playlistId, songId },
        });

        await prisma.playlistSong.updateMany({
            where: {
                playlistId,
                index: { gt: songToRemove.index },
            },
            data: {
                index: { decrement: 1 },
            },
        });

        res.status(200).json({ message: 'Song removed from playlist successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove song from playlist.' });
    }
};

// add logic for sharing   