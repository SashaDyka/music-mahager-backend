import express from 'express';
import path from 'path'; 
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { authRoutes } from './routes/authRoutes.js';
import { songRoutes } from './routes/songRoutes.js';
import { userRoutes } from './routes/userRoutes.js';
import { playlistsRoutes } from './routes/playlistsRoutes.js';
import { sharingRoutes } from './routes/sharingRoutes.js';
import { mediaRoutes } from './routes/mediaRoutes.js'; 
import { streamingRoutes } from './routes/streamingRoutes.js';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/songs', songRoutes);
app.use('/playlists', playlistsRoutes);
app.use('/share', sharingRoutes);
app.use('/media', mediaRoutes);
app.use('/stream', streamingRoutes);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

export default app;