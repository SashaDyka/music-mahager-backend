import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});


const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/ogg' || file.mimetype === 'audio/aac' || file.mimetype === 'audio/wav') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

export const upload = multer({ storage, fileFilter });