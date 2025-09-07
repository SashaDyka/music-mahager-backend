import type { Request, Response } from "express";
import { SongService } from "../services/songService.js";
import { SongRepository } from "../repositories/songRepository.js";

export class SongController {
  constructor(private readonly songService: SongService) {}

  async getSongs(req: Request, res: Response): Promise<void> {
    try {
      const songs = await this.songService.getSongs();
      res.status(200).json(songs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async getSongById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.user.id;
      const song = await this.songService.getSongById(id); 

      if (!song) {
        res.status(404).json({ message: 'Song not found' });
        return;
      }
      res.status(200).json(song);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async createSong(req: Request, res: Response): Promise<void> {
  try {
    const { title, durationSec, sourceType } = req.body;
    const audioUrl = req.file?.path; // uploadAudio middleware

    if (!audioUrl) {
      res.status(400).json({ message: 'Audio file required' });
      return;
    }

    const song = await this.songService.createSong(req.user.id, {
      title,
      durationSec: Number(durationSec),
      sourceType,
      audioUrl
    });

    res.status(201).json(song);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


}
