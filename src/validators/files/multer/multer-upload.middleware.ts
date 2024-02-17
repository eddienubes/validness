import type { Options } from 'multer';
import { RequestHandler } from 'express';
import { fileFilter } from '@src/validators/files/multer/file-filter.js';
import { loadMulter } from '@src/validators/files/multer/multerLoader.js';
import { ProcessedFileDtoConstructor } from '@src/validators/files/interfaces/processed-file-dto-constructor.interface.js';

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
