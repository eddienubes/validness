import { ClassConstructor } from '../../../common/interfaces/class-constructor.interface.ts';
import { Router } from 'express';
import { ProcessedFileDtoConstructor } from '../interfaces/processed-file-dto-constructor.interface.ts';
import { FileValidationConfig } from '../../../config/file-validation-config.interface.ts';

/**
 * Alias for a multer file type in the express multer namespace
 */
export type MulterFile = Express.Multer.File;
export type FileValidationChainGetter = (
    DtoConstructor: ClassConstructor,
    processedFileDtoConstructor: ProcessedFileDtoConstructor,
    fileValidationConfig?: Partial<FileValidationConfig>
) => Router;
