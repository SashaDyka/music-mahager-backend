import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
    };
}

export const getPlaylists = async (req: AuthenticatedRequest, res: Response) => {
    const ownerId = req.user?.userId;

    if (!ownerId) {
        return res.status(401).json({ error: 'Unauthorized.' });
    }

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
        console.error("Error fetching playlists:", error);
        res.status(500).json({ error: 'Failed to fetch playlists.' });
    }
};

export const createPlaylist = async (req: AuthenticatedRequest, res: Response) => {
    const { title } = req.body;
    const ownerId = req.user?.userId;

    if (!title || !ownerId) {
        return res.status(400).json({ error: 'Missing title or user ID.' });
    }

    try {
        const newPlaylist = await prisma.playlist.create({
            data: {
                title,
                ownerId,
            },
        });
        res.status(201).json(newPlaylist);
    } catch (error) {
        console.error("Error creating playlist:", error);
        res.status(500).json({ error: 'Failed to create playlist.' });
    }
};

export const getPlaylistDetails = async (req: AuthenticatedRequest, res: Response) => {
    const playlistId = req.params.id;

    if (!playlistId) {
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
        console.error("Error fetching playlist details:", error);
        res.status(500).json({ error: 'Failed to fetch playlist details.' });
    }
};

export const updatePlaylist = async (req: AuthenticatedRequest, res: Response) => {
    const playlistId = req.params.id;
    const { title } = req.body;
    const ownerId = req.user?.userId;

    if (!playlistId || !ownerId) {
        return res.status(400).json({ error: 'Invalid playlist ID or owner.' });
    }
    
    try {
        const updatedPlaylist = await prisma.playlist.update({
            where: { id: playlistId, ownerId: ownerId },
            data: { title },
        });
        res.status(200).json(updatedPlaylist);
    } catch (error) {
        console.error("Error updating playlist:", error);
        res.status(500).json({ error: 'Failed to update playlist.' });
    }
};

export const deletePlaylist = async (req: AuthenticatedRequest, res: Response) => {
    const playlistId = req.params.id;
    const ownerId = req.user?.userId;

    if (!playlistId || !ownerId) {
        return res.status(400).json({ error: 'Invalid playlist ID or owner.' });
    }
    
    try {
        const existingPlaylist = await prisma.playlist.findUnique({
            where: { id: playlistId, ownerId: ownerId }
        });
        
        if (!existingPlaylist) {
            return res.status(404).json({ error: 'Playlist not found or you do not have permission to delete it.' });
        }

        await prisma.playlistSong.deleteMany({
            where: { playlistId },
        });
        await prisma.playlist.delete({
            where: { id: playlistId },
        });

        res.status(200).json({ message: 'Playlist deleted successfully.' });
    } catch (error) {
        console.error("Error deleting playlist:", error);
        res.status(500).json({ error: 'Failed to delete playlist.' });
    }
};

export const addSongToPlaylist = async (req: AuthenticatedRequest, res: Response) => {
    const playlistId = req.params.id;
    const { songId } = req.body;

    if (!playlistId || !songId) {
        return res.status(400).json({ error: 'Invalid playlist or song ID.' });
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
        console.error("Error adding song to playlist:", error);
        res.status(500).json({ error: 'Failed to add song to playlist.' });
    }
};

export const removeSongFromPlaylist = async (req: AuthenticatedRequest, res: Response) => {
    const { id: playlistId, songId } = req.params;

    if (!playlistId || !songId) {
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
        console.error("Error removing song from playlist:", error);
        res.status(500).json({ error: 'Failed to remove song from playlist.' });
    }
};