import multer, { Options } from 'multer';
import { fileFilter } from './file-filter';
import { ProcessedFileDtoConstructor } from '../interfaces/processed-file-dto-constructor.interface';
import { RequestHandler } from 'express';
import { ClassConstructor } from '../../../common';

export const multerUploadMiddleware = (
    processedFileDtoConstructor: ProcessedFileDtoConstructor,
    DtoConstructor: ClassConstructor,
    coreConfig?: Options
): RequestHandler => {
    console.log('multerUploadMiddleware:', DtoConstructor.name, processedFileDtoConstructor.multerFields);
    const upload = multer({
        ...coreConfig,
        fileFilter: fileFilter(processedFileDtoConstructor.fileValidationMap)
    });

    return upload.fields(processedFileDtoConstructor.multerFields);
};
