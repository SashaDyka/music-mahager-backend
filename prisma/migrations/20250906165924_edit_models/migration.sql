-- CreateEnum
CREATE TYPE "public"."SourceType" AS ENUM ('LOCAL', 'S3', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "public"."ShareTargetType" AS ENUM ('Song', 'Playlist');

-- CreateEnum
CREATE TYPE "public"."RoomStatus" AS ENUM ('INACTIVE', 'ACTIVE');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."songs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "durationSec" INTEGER NOT NULL,
    "sourceType" "public"."SourceType" NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "songs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."playlists" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "playlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."playlist_song" (
    "id" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "playlist_song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."play_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "playedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "play_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."share_link" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "targetType" "public"."ShareTargetType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "share_link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."streaming_room" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "status" "public"."RoomStatus" NOT NULL DEFAULT 'INACTIVE',
    "roomCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "streaming_room_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "songs_ownerId_createdAt_idx" ON "public"."songs"("ownerId", "createdAt");

-- CreateIndex
CREATE INDEX "playlists_ownerId_createdAt_idx" ON "public"."playlists"("ownerId", "createdAt");

-- CreateIndex
CREATE INDEX "playlist_song_playlistId_position_idx" ON "public"."playlist_song"("playlistId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "playlist_song_playlistId_songId_key" ON "public"."playlist_song"("playlistId", "songId");

-- CreateIndex
CREATE UNIQUE INDEX "playlist_song_playlistId_position_key" ON "public"."playlist_song"("playlistId", "position");

-- CreateIndex
CREATE INDEX "play_history_userId_playedAt_idx" ON "public"."play_history"("userId", "playedAt" DESC);

-- CreateIndex
CREATE INDEX "play_history_songId_playedAt_idx" ON "public"."play_history"("songId", "playedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "share_link_token_key" ON "public"."share_link"("token");

-- CreateIndex
CREATE INDEX "share_link_ownerId_createdAt_idx" ON "public"."share_link"("ownerId", "createdAt");

-- CreateIndex
CREATE INDEX "share_link_targetType_targetId_idx" ON "public"."share_link"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "share_link_expiresAt_idx" ON "public"."share_link"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "streaming_room_roomCode_key" ON "public"."streaming_room"("roomCode");

-- CreateIndex
CREATE INDEX "streaming_room_ownerId_status_idx" ON "public"."streaming_room"("ownerId", "status");

-- AddForeignKey
ALTER TABLE "public"."songs" ADD CONSTRAINT "songs_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."playlists" ADD CONSTRAINT "playlists_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."playlist_song" ADD CONSTRAINT "playlist_song_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "public"."playlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."playlist_song" ADD CONSTRAINT "playlist_song_songId_fkey" FOREIGN KEY ("songId") REFERENCES "public"."songs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."play_history" ADD CONSTRAINT "play_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."play_history" ADD CONSTRAINT "play_history_songId_fkey" FOREIGN KEY ("songId") REFERENCES "public"."songs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."share_link" ADD CONSTRAINT "share_link_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."streaming_room" ADD CONSTRAINT "streaming_room_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
