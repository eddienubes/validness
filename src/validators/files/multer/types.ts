import { ClassConstructor } from '@src/common/interfaces/class-constructor.interface.js';
import { Router } from 'express';
import { ProcessedFileDtoConstructor } from '@src/validators/files/interfaces/processed-file-dto-constructor.interface.js';
import { FileValidationConfig } from '@src/config/file-validation-config.interface.js';

/**
 * Alias for a multer file type in the express multer namespace
 */
export type MulterFile = Express.Multer.File;
export type FileValidationChainGetter = (
    DtoConstructor: ClassConstructor,
    processedFileDtoConstructor: ProcessedFileDtoConstructor,
    fileValidationConfig?: Partial<FileValidationConfig>
) => Router;
