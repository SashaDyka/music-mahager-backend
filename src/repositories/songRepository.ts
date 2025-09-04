import prisma from "../prismaClient.js";
import { CreateSongDto } from "../dto/createSongDTO.js";


export class SongRepository {
    async create(data: CreateSongDto) {
        return prisma.song.create({ data });
    }     


  async findAll() {
    return prisma.song.findMany();
  }
}
