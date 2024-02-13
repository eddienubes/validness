import { Router } from 'express';
import {
    ClassConstructor,
    FileValidationConfig,
    ProcessedFileDtoConstructor
} from '@src/index.js';

/**
 * Alias for a multer file type in the express multer namespace
 */
export type MulterFile = Express.Multer.File;
export type FileValidationChainGetter = (
    DtoConstructor: ClassConstructor,
    processedFileDtoConstructor: ProcessedFileDtoConstructor,
    fileValidationConfig?: Partial<FileValidationConfig>
) => Router;
