import type { Request, Response } from 'express';
import { MediaService } from '../services/mediaService.js';
import fs from 'node:fs';
import path from 'node:path';
import mime from 'mime';

export interface AuthenticatedRequest extends Request {
  user?: { userId: string };
  file?: Express.Multer.File;
}

export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  async uploadFile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
      }

      const newSong = await this.mediaService.createSongFromUpload(
        req.user.userId,
        req.file,
      );

      res.status(201).json({
        message: 'File uploaded successfully',
        song: newSong,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to upload file.' });
    }
  }

  async getFile(req: Request, res: Response) {
    const uploadDir = path.resolve('uploads');
    const filePath = path.join(uploadDir, req.params.id!);

    fs.stat(filePath, (err, stat) => {
      if (err) {
        if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
          return res.status(404).json({ message: 'File not found.' });
        }
        return res.status(500).json({ message: 'Error reading file.' });
      }

      const fileSize = stat.size;
      const range = req.headers.range;
      const contentType = mime.lookup(filePath) || 'application/octet-stream';

      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = end - start + 1;

        const file = fs.createReadStream(filePath, { start, end });
        const headers = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': contentType,
        };

        res.writeHead(206, headers);
        file.pipe(res);
      } else {
        const headers = {
          'Content-Length': fileSize,
          'Content-Type': contentType,
        };
        res.writeHead(200, headers);
        fs.createReadStream(filePath).pipe(res);
      }
    });
  }
}
