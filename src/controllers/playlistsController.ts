import type { Request, Response } from 'express';

export const getPlaylists = (req: Request, res: Response) => {
    res.status(200).json({ playlists: [] });
};

export const createPlaylist = (req: Request, res: Response) => {
    res.status(201).json({ message: 'Playlist created.' });
};

export const getPlaylistDetails = (req: Request, res: Response) => {
    res.status(200).json({ message: 'Playlist details.' });
};

export const updatePlaylist = (req: Request, res: Response) => {
    res.status(200).json({ message: 'Playlist updated.' });
};

export const deletePlaylist = (req: Request, res: Response) => {
    res.status(200).json({ message: 'Playlist deleted.' });
};

export const addSongToPlaylist = (req: Request, res: Response) => {
    res.status(200).json({ message: 'Song added to playlist.' });
};

export const removeSongFromPlaylist = (req: Request, res: Response) => {
    res.status(200).json({ message: 'Song removed from playlist.' });
};