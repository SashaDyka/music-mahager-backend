/*
  Warnings:

  - Added the required column `index` to the `playlist_song` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."playlist_song" ADD COLUMN     "index" INTEGER NOT NULL;
