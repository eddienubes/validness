import { Router } from 'express';
import { multerUploadMiddleware } from './multer-upload.middleware';
import { multerValidationMiddleware } from './multer-validation.middleware';
import { multerModificationMiddleware } from './multer-modification.middleware';
import { ProcessedFileDtoConstructor } from '../interfaces/processed-file-dto-constructor.interface';
import { ClassConstructor, CustomErrorFactory } from '../../../common';
import { FileValidationConfig } from '../../../config/file-validation-config.interface';
import { multerErrorHandlerMiddleware } from './multer-error-handler.middleware';

export const getMulterFileValidationChain = (
    DtoConstructor: ClassConstructor,
    processedFileDtoConstructor: ProcessedFileDtoConstructor,
    fileValidationConfig?: Partial<FileValidationConfig>,
    customErrorFactory?: CustomErrorFactory
): Router => {
    const router = Router();

    router.use(
        multerUploadMiddleware(DtoConstructor, processedFileDtoConstructor, fileValidationConfig),
        multerValidationMiddleware(processedFileDtoConstructor),
        multerModificationMiddleware(processedFileDtoConstructor),
        multerErrorHandlerMiddleware(customErrorFactory)
    );

    return router;
};
