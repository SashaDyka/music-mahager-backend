import prisma from "../prismaClient.js";

export class PlaylistRepository {
  async findAll() {
    return prisma.playlist.findMany({
      include: { songs: true },
    });
  }
}
