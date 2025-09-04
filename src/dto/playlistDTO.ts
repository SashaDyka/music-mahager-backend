import { SongResponseDto } from "./songDTO.js";

export class PlaylistResponseDto {
  id: number;
  name: string;
  songs: SongResponseDto[];

  constructor(playlist: any) {
    this.id = playlist.id;
    this.name = playlist.name;
    this.songs = playlist.songs?.map((s: any) => new SongResponseDto(s)) || [];
  }
}
