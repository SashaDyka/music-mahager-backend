import type { Request, Response } from "express";
import { SongService } from "../services/songService.js";


export class SongController {
  constructor(private readonly songService: SongService) {}

  async getSongs(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      const songs = await this.songService.getSongs(req.user.userId);
      res.status(200).json(songs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getSongById(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    try {
      const { id } = req.params;
      const song = await this.songService.getSongById(req.user.userId, id);
      if (!song) {
        res.status(404).json({ message: "Song not found" });
        return;
      }
      res.status(200).json(song);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async createSong(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      const { title, durationSec, sourceType } = req.body;
      const fileId = req.file?.filename; 

      if (!fileId) {
        res.status(400).json({ message: "Audio file required" });
        return;
      }
      
      const audioUrl = `/media/file/${fileId}`;

      const song = await this.songService.createSong(req.user.userId, {
        title,
        durationSec: Number(durationSec),
        sourceType,
        audioUrl,
      });

      res.status(201).json(song);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async updateSong(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      const { id } = req.params;
      const updated = await this.songService.updateSong(req.user.userId, id, req.body);

      if (updated.count === 0) {
        res.status(404).json({ message: "Song not found or no access" });
        return;
      }

      res.status(200).json({ message: "Song updated" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  
   async deleteSong(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      const { id } = req.params;
      const deleted = await this.songService.deleteSong(req.user.userId, id);

      if (deleted.count === 0) {
        res.status(404).json({ message: "Song not found or no access" });
        return;
      }

      res.status(200).json({ message: "Song deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

}

