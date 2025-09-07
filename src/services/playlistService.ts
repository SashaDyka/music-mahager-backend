import { PrismaClient, SourceType } from '@prisma/client';
import { PlaylistDto, PlaylistWithSongsDto, AddSongToPlaylistDto } from '../dto/playlistDTO.js';
import { SongResponseDto } from '../dto/songDTO.js';

const mapSongToDto = (song: any): SongResponseDto => ({
  id: song.id,
  title: song.title,
  durationSec: song.durationSec,
  sourceType: song.sourceType,
  audioUrl: song.audioUrl,
});

export class PlaylistService {
  constructor(private readonly prisma: PrismaClient) {}

  async createPlaylist(ownerId: string, title: string) {
    return this.prisma.playlist.create({
      data: {
        title,
        ownerId,
      },
    });
  }

  async getPlaylists(ownerId: string): Promise<PlaylistDto[]> {
    const playlists = await this.prisma.playlist.findMany({
      where: { ownerId },
      include: {
        _count: {
          select: { songs: true },
        },
      },
    });

    return playlists.map(p => ({
      id: p.id,
      title: p.title,
      isPublic: p.isPublic,
      songCount: p._count.songs,
    }));
  }

   async getPlaylistById(id: string): Promise<PlaylistWithSongsDto | null> {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id },
      include: {
        songs: {
          orderBy: { position: 'asc' },
          include: { song: true },
        },
      },
    });

    if (!playlist) {
      return null;
    }

    return {
      id: playlist.id,
      title: playlist.title,
      isPublic: playlist.isPublic,
      songs: playlist.songs.map(ps => ({
        position: ps.position,
        song: mapSongToDto(ps.song),
      })),
    };
  }

  async updatePlaylist(ownerId: string, playlistId: string, data: { title?: string; isPublic?: boolean }) {
    return this.prisma.playlist.updateMany({
      where: { id: playlistId, ownerId },
      data,
    });
  }

  async deletePlaylist(ownerId: string, playlistId: string) {
    return this.prisma.playlist.deleteMany({
      where: { id: playlistId, ownerId },
    });
  }

  async addSongToPlaylist(userId: string, playlistId: string, songId: string, position: number) {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id: playlistId },
      include: { songs: true },
    });

    if (!playlist) {
      throw new Error('Playlist not found');
    }

    const newPosition = playlist.songs.length;

    return this.prisma.playlistSong.create({
      data: {
        playlistId,
        songId,
        position: newPosition,
      },
    });
  }

  async removeSongFromPlaylist(playlistId: string, playlistSongId: string) {
    return this.prisma.playlistSong.delete({
      where: {
        id: playlistSongId,
        playlistId,
      },
    });
  }
}