import { Request } from 'express';
import type { FileFilterCallback } from 'multer';
import { MulterFile } from '@src/validators/files/multer/types.js';
import { FileMetadata } from '@src/validators/files/interfaces/file-metadata.interface.js';

export type FileValidationMap = Record<string, FileMetadata>;
export type MulterFileFilter = (
    req: Request,
    file: MulterFile,
    callback: FileFilterCallback
) => Promise<void>;
