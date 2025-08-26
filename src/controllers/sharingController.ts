import type { Request, Response } from 'express';

export const createShareLink = (req: Request, res: Response) => {
    res.status(201).json({ shareId: 'uuid' });
};

export const revokeShareLink = (req: Request, res: Response) => {
    res.status(200).send('Access revoked.');
};

export const getPublicSong = (req: Request, res: Response) => {
    res.status(200).json({ message: 'Public song details.' });
};

export const getPublicPlaylist = (req: Request, res: Response) => {
    res.status(200).json({ message: 'Public playlist details.' });
};