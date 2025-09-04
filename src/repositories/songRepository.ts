import prisma from "../prismaClient.js";
import { CreateSongDto } from "../dto/createSongDTO.js";

export class SongRepository {
  async create(data: CreateSongDto) {
    return prisma.song.create({ data });
  }

  async findById(id: string) {
    return prisma.song.findUnique({ where: { id } });
  }

  async findAll() {
    return prisma.song.findMany();
  }

  async findByPlaylist(playlistId: string) {
    return prisma.song.findMany({
      where: { playlistId },
      orderBy: { position: "asc" },
    });
  }

  async getLastPosition(playlistId: string): Promise<number> {
    const last = await prisma.song.findFirst({
      where: { playlistId },
      orderBy: { position: "desc" },
      select: { position: true },
    });
    return last ? last.position : 0;
  }

  async update(id: string, data: Partial<CreateSongDto>) {
    return prisma.song.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.song.delete({ where: { id } });
  }
}