import type { Options } from 'multer';
import { RequestHandler } from 'express';
import { ProcessedFileDtoConstructor } from '@src/index.js';
import { fileFilter } from '@src/validators/files/multer/file-filter.js';
import { loadMulter } from '@src/validators/files/multer/multerLoader.js';

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
