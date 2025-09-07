import { PrismaClient, SourceType  } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();
const audioDir = path.join(__dirname, '..', 'public', 'uploads');


async function main() {
  console.log(`Filling the database..`);

  await prisma.user.deleteMany();
  await prisma.song.deleteMany();
  await prisma.playlist.deleteMany();
  await prisma.playlistSong.deleteMany();


  const user1 = await prisma.user.create({
    data: {
      email: 'user@example.com',
      passwordHash: 'hashed_password_123', 
      displayName: 'Test User',
    },
  });
  console.log(`Create user: ${user1.displayName} (${user1.id})`);

  const audioFiles = fs.readdirSync(audioDir);
  const createdSongs = [];

  for (const [index, file] of audioFiles.entries()) {
    const title = path.parse(file).name;
    const song = await prisma.song.create({
      data: {
        title: title,
        durationSec: 186, 
        sourceType: SourceType.LOCAL,
        audioUrl: `/uploads/smaragdove-nebo.mp3`, 
        ownerId: user1.id,
      },
    });
    createdSongs.push(song);
    console.log(`Created song: ${song.title}`);
  }

  const playlist1 = await prisma.playlist.create({
    data: {
      title: 'My Favorite Songs',
      ownerId: user1.id,
      isPublic: true,
    },
  });
  console.log(`Created playlist: ${playlist1.title} (${playlist1.id})`);


  if (createdSongs.length > 0) {
    const playlistSongsData = createdSongs.map((song, index) => ({
      playlistId: playlist1.id,
      songId: song.id,
      position: index + 1,
    }));

    await prisma.playlistSong.createMany({
      data: playlistSongsData,
    });
    console.log(`Added ${createdSongs.length} songs to the playlist.`);
  }

  console.log(`The database has been filled.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });