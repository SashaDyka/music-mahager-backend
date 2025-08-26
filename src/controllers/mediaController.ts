import type { Request, Response } from 'express';

export const uploadFile = (req: Request, res: Response) => {
    res.status(201).json({ fileId: '123', message: 'File uploaded.' });
};

export const getFile = (req: Request, res: Response) => {
    res.status(200).send('File content.');
};