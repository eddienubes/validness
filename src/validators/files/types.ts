import { FileMetadata } from '@src/index.js';
import { Request } from 'express';
import type { FileFilterCallback } from 'multer';
import { MulterFile } from '@src/validators/files/multer/types.js';

export type FileValidationMap = Record<string, FileMetadata>;
export type MulterFileFilter = (
    req: Request,
    file: MulterFile,
    callback: FileFilterCallback
) => Promise<void>;
