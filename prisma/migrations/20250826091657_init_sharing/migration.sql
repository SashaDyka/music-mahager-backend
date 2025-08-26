/*
  Warnings:

  - You are about to drop the column `trackId` on the `likes` table. All the data in the column will be lost.
  - You are about to drop the column `trackId` on the `play_history` table. All the data in the column will be lost.
  - You are about to drop the `playlist_track` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tracks` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,songId]` on the table `likes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `songId` to the `likes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `songId` to the `play_history` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ShareTargetType" AS ENUM ('Song', 'Playlist');

-- CreateEnum
CREATE TYPE "public"."RoomStatus" AS ENUM ('INACTIVE', 'ACTIVE');

-- DropForeignKey
ALTER TABLE "public"."likes" DROP CONSTRAINT "likes_trackId_fkey";

-- DropForeignKey
ALTER TABLE "public"."play_history" DROP CONSTRAINT "play_history_trackId_fkey";

-- DropForeignKey
ALTER TABLE "public"."playlist_track" DROP CONSTRAINT "playlist_track_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "public"."playlist_track" DROP CONSTRAINT "playlist_track_trackId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tracks" DROP CONSTRAINT "tracks_albumId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tracks" DROP CONSTRAINT "tracks_artistId_fkey";

-- DropIndex
DROP INDEX "public"."likes_userId_trackId_key";

-- AlterTable
ALTER TABLE "public"."likes" DROP COLUMN "trackId",
ADD COLUMN     "songId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."play_history" DROP COLUMN "trackId",
ADD COLUMN     "songId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."playlist_track";

-- DropTable
DROP TABLE "public"."tracks";

-- CreateTable
CREATE TABLE "public"."songs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "durationSec" INTEGER NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "albumId" TEXT,
    "artistId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "songs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."playlist_song" (
    "id" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "playlist_song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShareLink" (
    "id" TEXT NOT NULL,
    "targetType" "public"."ShareTargetType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "ShareLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StreamingRoom" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "status" "public"."RoomStatus" NOT NULL DEFAULT 'INACTIVE',

    CONSTRAINT "StreamingRoom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "likes_userId_songId_key" ON "public"."likes"("userId", "songId");

-- AddForeignKey
ALTER TABLE "public"."songs" ADD CONSTRAINT "songs_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "public"."albums"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."songs" ADD CONSTRAINT "songs_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."artists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."playlist_song" ADD CONSTRAINT "playlist_song_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "public"."playlists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."playlist_song" ADD CONSTRAINT "playlist_song_songId_fkey" FOREIGN KEY ("songId") REFERENCES "public"."songs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_songId_fkey" FOREIGN KEY ("songId") REFERENCES "public"."songs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."play_history" ADD CONSTRAINT "play_history_songId_fkey" FOREIGN KEY ("songId") REFERENCES "public"."songs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShareLink" ADD CONSTRAINT "ShareLink_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StreamingRoom" ADD CONSTRAINT "StreamingRoom_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
