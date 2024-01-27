import multer, { Options } from 'multer';
import { RequestHandler } from 'express';
import { ProcessedFileDtoConstructor } from '@src/index.js';
import { fileFilter } from '@src/validators/files/multer/file-filter.js';

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
