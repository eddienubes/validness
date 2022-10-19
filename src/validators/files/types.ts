import { FileMetadata } from './interfaces/file-metadata.interface';
import { Request } from 'express';
import { FileFilterCallback } from 'multer';
import { MulterFile } from './multer/types';
import { FileValidationConfig } from '@src/config/file-validation-config.interface';
import { CustomErrorFactory } from '@src';

export type FileValidationMap = Record<string, FileMetadata>;
export type MulterFileFilter = (req: Request, file: MulterFile, callback: FileFilterCallback) => Promise<void>;
export type ValidationFileConfig = Partial<FileValidationConfig> & { customErrorFactory?: CustomErrorFactory };
