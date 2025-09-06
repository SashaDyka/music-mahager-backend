import { PrismaClient, SourceType } from '@prisma/client';
import { FileStorage } from './fileStorage.js';
import { SongResponseDto } from '../dto/songDTO.js';

export class SongService {
  constructor(private readonly prisma: PrismaClient) {}

  async getSongs(): Promise<SongResponseDto[]> {
    const songs = await this.prisma.song.findMany();
    return this.mapToDto(songs);
  }

  async getSongById(id: string): Promise<SongResponseDto | null> {
    const song = await this.prisma.song.findUnique({
      where: { id },
    });
    if (!song) {
      return null;
    }
    return this.mapToDto([song])[0];
  }

  private mapToDto(songs: Song[]): SongResponseDto[] {
    return songs.map(song => ({
      id: song.id,
      title: song.title,
      durationSec: song.durationSec,
      sourceType: song.sourceType,
      audioUrl: song.audioUrl,
    }));
  }
}