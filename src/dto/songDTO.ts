import type { Song } from "@prisma/client";

export class SongResponseDto {
  id: string;
  title: string;
  durationSec: number;
  sourceType: string;
  audioUrl: string;
  
  constructor(song: any) {
    this.id = song.id;
    this.title = song.title;
    this.durationSec = song.durationSec;
    this.sourceType = song.sourceType;
    this.audioUrl = song.audioUrl;
  }
}