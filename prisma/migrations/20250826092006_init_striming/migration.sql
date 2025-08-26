/*
  Warnings:

  - You are about to drop the `ShareLink` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StreamingRoom` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ShareLink" DROP CONSTRAINT "ShareLink_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StreamingRoom" DROP CONSTRAINT "StreamingRoom_ownerId_fkey";

-- DropTable
DROP TABLE "public"."ShareLink";

-- DropTable
DROP TABLE "public"."StreamingRoom";

-- CreateTable
CREATE TABLE "public"."share_link" (
    "id" TEXT NOT NULL,
    "targetType" "public"."ShareTargetType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "share_link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."streaming_room" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "status" "public"."RoomStatus" NOT NULL DEFAULT 'INACTIVE',

    CONSTRAINT "streaming_room_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."share_link" ADD CONSTRAINT "share_link_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."streaming_room" ADD CONSTRAINT "streaming_room_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
