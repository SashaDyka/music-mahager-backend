import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET as string;

interface JwtPayload {
    userId: number;
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ message: 'Authorization token not found.' });
    }

    try {
        const decoded = jwt.verify(token, secret) as JwtPayload;
        // @ts-ignore
        req.user = decoded; 
        next();
    } catch (error) {
        res.clearCookie('jwt'); 
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
};