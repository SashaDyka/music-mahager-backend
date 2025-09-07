import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { PlaylistService } from "../services/playlistService.js";


export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistService) {}

  async getPlaylists(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const playlists = await this.playlistsService.getPlaylists(req.user.userId);
      res.status(200).json(playlists);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async createPlaylist(req: Request, res: Response){
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const { title, isPublic } = req.body;
      const playlist = await this.playlistsService.createPlaylist(req.user.userId, title);


      res.status(201).json(playlist);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getPlaylistDetails(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { id } = req.params;
      const playlist = await this.playlistsService.getPlaylistById(req.user.userId, id);

      if (!playlist) {
        return res.status(404).json({ message: "Playlist not found" });
      }

      res.status(200).json(playlist);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async updatePlaylist(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { id } = req.params;
      const updated = await this.playlistsService.updatePlaylist(
        req.user.userId,
        id,
        req.body
      );

      if (!updated) {
        return res.status(404).json({ message: "Playlist not found or no access" });
      }

      res.status(200).json({ message: "Playlist updated" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async deletePlaylist(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { id } = req.params;
      const deleted = await this.playlistsService.deletePlaylist(req.user.userId, id);

      if (!deleted) {
        return res.status(404).json({ message: "Playlist not found or no access" });
      }

      res.status(200).json({ message: "Playlist deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async addSongToPlaylist(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { id } = req.params; 
      const { songId, position } = req.body;

      const added = await this.playlistsService.addSongToPlaylist(
        req.user.userId,
        id,
        songId,
        position
      );

      if (!added) {
        return res.status(404).json({ message: "Playlist not found or no access" });
      }

      res.status(200).json({ message: "Song added to playlist" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async removeSongFromPlaylist(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const { id, songId } = req.params;

      const removed = await this.playlistsService.removeSongFromPlaylist(
        req.user.userId,
        id,
        songId
      );

      if (!removed) {
        return res.status(404).json({ message: "Playlist or song not found or no access" });
      }

      res.status(200).json({ message: "Song removed from playlist" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
