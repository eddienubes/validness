import { FileMetadata } from './interfaces/file-metadata.interface';
import { Request, Express } from 'express';
import { FileFilterCallback } from 'multer';

export type FileValidationMap = Record<string, FileMetadata>;
export type MulterFileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => void;
