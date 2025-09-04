import { PlaylistRepository } from "../repositories/playlistRepository.js";
import { PlaylistResponseDto } from "../dto/playlistDTO.js";

export class PlaylistService {
  private repo: PlaylistRepository;

  constructor() {
    this.repo = new PlaylistRepository();
  }

  async getPlaylists(): Promise<PlaylistResponseDto[]> {
    const playlists = await this.repo.findAll();
    return playlists.map((p) => new PlaylistResponseDto(p));
  }
}
