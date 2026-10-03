import { Request } from 'express';
import type { FileFilterCallback } from 'multer';
import { MulterFile } from './multer/types.ts';
import { FileMetadata } from './interfaces/file-metadata.interface.ts';

export type FileValidationMap = Record<string, FileMetadata>;
export type MulterFileFilter = (
    req: Request,
    file: MulterFile,
    callback: FileFilterCallback
) => Promise<void>;
