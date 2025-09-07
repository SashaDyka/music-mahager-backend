import { PrismaClient } from '@prisma/client';
import { SongResponseDto } from '../dto/songDTO.js';
import type { Song } from "@prisma/client";


export class SongService {
  constructor(private readonly prisma: PrismaClient) {}

  async getSongs(userId: string): Promise<SongResponseDto[]> {
    const songs = await this.prisma.song.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
    });
    return this.mapToDto(songs);
  }

  async getSongById(userId: string, id: string): Promise<SongResponseDto | null> {
    const song = await this.prisma.song.findFirst({
      where: { id, ownerId: userId },
    });
    if (!song) return null;
    return new SongResponseDto(song);
  }

  async createSong(
    userId: string,
    data: { title: string; durationSec: number; sourceType: string; audioUrl: string }
  ): Promise<SongResponseDto> {
    const song = await this.prisma.song.create({
      data: { ...data, ownerId: userId },
    });
    return new SongResponseDto(song);
  }

  async updateSong(
    userId: string,
    id: string,
    data: Partial<{ title: string; durationSec: number; sourceType: string; audioUrl: string }>
  ): Promise<{ count: number }> {
    const result = await this.prisma.song.updateMany({
      where: { id, ownerId: userId },
      data,
    });
    return result;
  }

  private mapToDto(songs: Song[]): SongResponseDto[] {
    return songs.map(song => new SongResponseDto(song));
  }
}