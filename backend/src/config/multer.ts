import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];

export default multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
    fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
            return;
        }

        cb(new Error('Tipo de arquivo inválido'));
    },
});
