import { PrismaClient } from '@prisma/client';
import { SongResponseDto} from '../dto/songDTO.js';

export class MediaService {
  constructor(private readonly prisma: PrismaClient) {}

  async createSongFromUpload(
    userId: string,
    file: Express.Multer.File,
  ): Promise<SongResponseDto> {
    const newSong = await this.prisma.song.create({
      data: {
        title: file.originalname,
        durationSec: 0, 
        sourceType: 'LOCAL',
        audioUrl: `/uploads/${file.filename}`,
        ownerId: userId,
      },
    });

    return {
      id: newSong.id,
      title: newSong.title,
      durationSec: newSong.durationSec,
      sourceType: newSong.sourceType,
      audioUrl: newSong.audioUrl,
    };
  }
}