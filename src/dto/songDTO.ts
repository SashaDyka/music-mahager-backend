export class SongResponseDto {
  id: number;
  title: string;
  artist: string;
  playlistId?: number;

  constructor(song: any) {
    this.id = song.id;
    this.title = song.title;
    this.artist = song.artist;
    this.playlistId = song.playlistId;
  }
}