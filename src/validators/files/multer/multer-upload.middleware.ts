import type { Options } from 'multer';
import { RequestHandler } from 'express';
import { fileFilter } from './file-filter.ts';
import { loadMulter } from './multerLoader.ts';
import { ProcessedFileDtoConstructor } from '../interfaces/processed-file-dto-constructor.interface.ts';

export const multerUploadMiddleware = (
    processedFileDtoConstructor: ProcessedFileDtoConstructor,
    coreConfig: Options
): RequestHandler => {
    const multer = loadMulter();

    const upload = multer({
        ...coreConfig,
        fileFilter: fileFilter(processedFileDtoConstructor.fileValidationMap)
    });

    return upload.fields(processedFileDtoConstructor.multerFields);
};
