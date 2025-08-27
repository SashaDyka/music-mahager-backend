/*
  Warnings:

  - Added the required column `ownerId` to the `songs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceType` to the `songs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."songs" ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD COLUMN     "sourceType" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."songs" ADD CONSTRAINT "songs_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
