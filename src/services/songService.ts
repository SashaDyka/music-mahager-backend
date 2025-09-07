import { PrismaClient, SourceType } from '@prisma/client';
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
    data: { title: string; durationSec: number; sourceType: string; fileId: string } ): Promise<SongResponseDto> {
   
      const audioUrl = `/media/file/${data.fileId}`;
       
      const song = await this.prisma.song.create({
      data: { title: data.title,
        durationSec: data.durationSec,
        audioUrl,
        sourceType: data.sourceType as SourceType,
        ownerId: userId,
      },
    });
    return new SongResponseDto(song);
  }

  async updateSong(
    userId: string,
    id: string,
    data: {
      title?: string;
      durationSec?: number;
      sourceType?: SourceType; 
      audioUrl?: string;
    }
  ): Promise<{ count: number }> {
    const updateData: {
      title?: string;
      durationSec?: number;
      sourceType?: SourceType;
      audioUrl?: string;
    } = {};

    if (data.title) updateData.title = data.title;
    if (data.durationSec) updateData.durationSec = data.durationSec;
    if (data.audioUrl) updateData.audioUrl = data.audioUrl;
    if (data.sourceType) {
      updateData.sourceType = data.sourceType as SourceType;
    }

    const result = await this.prisma.song.updateMany({
      where: { id, ownerId: userId },
      data: updateData,
    });
    return result;
  }

  async deleteSong(userId: string, id: string): Promise<{ count: number }> {
    const result = await this.prisma.song.deleteMany({
      where: { id, ownerId: userId },
    });
    return result;
  }

  private mapToDto(songs: Song[]): SongResponseDto[] {
    return songs.map(song => new SongResponseDto(song));
  }
}