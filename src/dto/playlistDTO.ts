import { SongResponseDto } from "./songDTO.js";

export class CreatePlaylistDto {
  constructor(public readonly title: string) {}
}

export class PlaylistDto {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly isPublic: boolean,
    public readonly songCount: number
  ) {}
}

export class PlaylistWithSongsDto {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly isPublic: boolean,
    public readonly songs: { position: number; song: SongResponseDto }[]
  ) {}
}

export class AddSongToPlaylistDto {
  constructor(public readonly songId: string) {}
}