import express from 'express';
import path from 'path'; 
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { authRoutes } from './routes/authRoutes.js';
import { songRoutes } from './routes/songRoutes.js';
import { playlistsRoutes } from './routes/playlistsRoutes.js';
import { sharingRoutes } from './routes/sharingRoutes.js';
import { mediaRoutes } from './routes/mediaRoutes.js';
import { streamingRoutes } from './routes/streamingRoutes.js';
import swaggerUi from 'swagger-ui-express';
/*import swaggerDocument from './swagger.json'; */ // add file

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 


// Logg
console.log(`Serving static files from: ${path.join(__dirname, '..', 'uploads')}`);

// Route
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/auth', authRoutes);
app.use('/songs', songRoutes);
app.use('/playlists', playlistsRoutes);
app.use('/share', sharingRoutes);
app.use('/media', mediaRoutes);
app.use('/stream', streamingRoutes);
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

export default app;