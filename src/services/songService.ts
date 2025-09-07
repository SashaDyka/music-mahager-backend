import { PrismaClient, SourceType } from '@prisma/client';
import { SongResponseDto } from '../dto/songDTO.js';

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