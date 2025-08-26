import type { Request, Response } from 'express';

export const getSongs = (req: Request, res: Response) => {
    res.status(200).json({ songs: [] });
};

export const createSong = (req: Request, res: Response) => {
    res.status(201).json({ message: 'Song created.' });
};

export const getSongDetails = (req: Request, res: Response) => {
    res.status(200).json({ message: 'Song details.' });
};

export const updateSong = (req: Request, res: Response) => {
    res.status(200).json({ message: 'Song updated.' });
};

export const deleteSong = (req: Request, res: Response) => {
    res.status(200).json({ message: 'Song deleted.' });
};