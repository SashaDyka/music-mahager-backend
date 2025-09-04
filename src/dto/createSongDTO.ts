export class CreateSongDto {
  title: string;
  artist: string;
  duration: number;
  playlistId?: number;
  filePath: string;
  
}
