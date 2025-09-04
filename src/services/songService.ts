import { SongRepository } from "../repositories/songRepository.js";
import { SongResponseDto } from "../dto/songDTO.js";

export class SongService {
  private repo: SongRepository;

  constructor() {
    this.repo = new SongRepository();
  }

  async getSongs(): Promise<SongResponseDto[]> {
    const songs = await this.repo.findAll();
    return songs.map((song) => new SongResponseDto(song));
  }
}
