import { PrismaClient, SourceType } from '@prisma/client';
import { FileStorage } from './fileStorage.js';
import fs from 'node:fs/promises';

export class SongService {
  constructor(
    private prisma = new PrismaClient(),
    private storage = new FileStorage()
  ) {}

  private async nextPosition(playlistId: string): Promise<number> {
    const last = await this.prisma.song.findFirst({
      where: { playlistId },
      orderBy: { position: 'desc' },
      select: { position: true },
    });
    return last ? last.position + 1 : 1;
  }

  private async createSongRecord(params: {
    ownerId: string;
    title: string;
    playlistId: string;
    audioRelPath: string;
    sourceType: SourceType;
  }): Promise<string> {
    const position = await this.nextPosition(params.playlistId);

    const created = await this.prisma.song.create({
      data: {
        title: params.title,
        durationSec: 0,
        sourceType: params.sourceType,
        audioUrl: params.audioRelPath,
        ownerId: params.ownerId,
        playlistId: params.playlistId,
        position,
      },
      select: { id: true },
    });

    return created.id;
  }

  async createFromFile(opts: {
    ownerId: string;
    title: string;
    playlistId: string;
    tempFilePath: string;
  }): Promise<string> {
    try {
      const { relPath } = await this.storage.saveUploaded(opts.tempFilePath, '.mp3');
      return await this.createSongRecord({
        ownerId: opts.ownerId,
        title: opts.title,
        playlistId: opts.playlistId,
        audioRelPath: relPath,
        sourceType: SourceType.LOCAL,
      });
    } catch (err) {
      try { await fs.unlink(opts.tempFilePath); } catch {}
      throw err;
    }
  }

  async createFromUrl(opts: {
    ownerId: string;
    title: string;
    playlistId: string;
    remoteUrl: string;
  }): Promise<string> {
    const { relPath } = await this.storage.saveFromUrl(opts.remoteUrl);
    return this.createSongRecord({
      ownerId: opts.ownerId,
      title: opts.title,
      playlistId: opts.playlistId,
      audioRelPath: relPath,
      sourceType: SourceType.LOCAL, 
    });
  }
}
