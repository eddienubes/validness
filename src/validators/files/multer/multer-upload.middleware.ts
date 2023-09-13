import multer, { Options } from 'multer';
import { fileFilter } from './file-filter';
import { ProcessedFileDtoConstructor } from '../interfaces/processed-file-dto-constructor.interface';
import { RequestHandler } from 'express';
import { ClassConstructor } from '@src';

export const multerUploadMiddleware = (
    processedFileDtoConstructor: ProcessedFileDtoConstructor,
    coreConfig: Options
): RequestHandler => {
    const upload = multer({
        ...coreConfig,
        fileFilter: fileFilter(processedFileDtoConstructor.fileValidationMap)
    });

    return upload.fields(processedFileDtoConstructor.multerFields);
};
