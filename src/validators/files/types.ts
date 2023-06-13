import { FileMetadata } from './interfaces/file-metadata.interface';
import { Request } from 'express';
import { FileFilterCallback } from 'multer';
import { MulterFile } from './multer/types';

export type FileValidationMap = Record<string, FileMetadata>;
export type MulterFileFilter = (
    req: Request,
    file: MulterFile,
    callback: FileFilterCallback
) => Promise<void>;
