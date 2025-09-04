import type { Request, Response } from "express";
import { SongService } from "../services/songService.js";
import { SongRepository } from "../repositories/songRepository.js";

const service = new SongService();
const repo = new SongRepository();

export async function getSongs(req: Request, res: Response) {
  try {
    const { playlistId } = req.query as { playlistId?: string };
    const data = playlistId
      ? await repo.findByPlaylist(playlistId)
      : await repo.findAll();
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
}

export async function createSong(req: Request, res: Response) {
  try {
    const ownerId = (req as any).user?.id; 
    if (!ownerId) return res.status(401).json({ message: "Unauthorized" });

    const { title, playlistId, remoteUrl } = req.body as {
      title?: string;
      playlistId?: string;
      remoteUrl?: string;
    };
    if (!title || !playlistId) {
      return res
        .status(400)
        .json({ message: "title и playlistId обязательны" });
    }

    const tempPath = (req as any).file?.path; 
    let id: string;

    if (tempPath) {
      id = await service.createFromFile({
        ownerId,
        title,
        playlistId,
        tempFilePath: tempPath,
      });
    } else if (remoteUrl) {
      id = await service.createFromUrl({
        ownerId,
        title,
        playlistId,
        remoteUrl,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Добавьте файл (audioFile) или remoteUrl" });
    }

    res.status(201).json({ id });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
}

export async function getSongDetails(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const song = await repo.findById(id);
    if (!song) return res.status(404).json({ message: "Song not found" });
    res.json(song);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
}

export async function updateSong(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title } = req.body as { title?: string };

    if (!title) return res.status(400).json({ message: "Nothing to update" });

    const updated = await repo.update(id, { title } as any);
    res.json(updated);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
}

export async function deleteSong(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await repo.delete(id);
    res.status(204).send();
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
}
