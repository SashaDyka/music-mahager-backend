import multer from 'multer';
import path from 'node:path';
import { randomUUID } from 'node:crypto';


const storage = multer.diskStorage({
destination: (req, file, cb) => cb(null, path.resolve('uploads')),
filename: (req, file, cb) => cb(null, `${randomUUID()}.mp3`),
});


export const uploadAudio = multer({
storage,
limits: { fileSize: 50 * 1024 * 1024 }, 
fileFilter: (req, file, cb) => {
if (file.mimetype.startsWith('audio/')) cb(null, true);
else cb(new Error('Only audio/* files are allowed'));
},
});
