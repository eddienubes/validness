import { Express, Router } from 'express';
import { ClassConstructor } from '@src';
import { ProcessedFileDtoConstructor } from '../interfaces/processed-file-dto-constructor.interface';
import { FileValidationConfig } from '@src/config/file-validation-config.interface';

/**
 * Alias for a multer file type in the express multer namespace
 */
export type MulterFile = Express.Multer.File;
export type FileValidationChainGetter = (
    DtoConstructor: ClassConstructor,
    processedFileDtoConstructor: ProcessedFileDtoConstructor,
    fileValidationConfig?: Partial<FileValidationConfig>
) => Router;
