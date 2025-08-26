import type { Request, Response } from 'express';

export const createRoom = (req: Request, res: Response) => {
    res.status(201).json({ roomId: 'room123' });
};

export const getRoomStatus = (req: Request, res: Response) => {
    res.status(200).json({ status: 'active' });
};