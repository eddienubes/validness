import { Router } from 'express';
import { multerUploadMiddleware } from './multer-upload.middleware';
import { multerValidationMiddleware } from './multer-validation.middleware';
import { multerModificationMiddleware } from './multer-modification.middleware';
import { ProcessedFileDtoConstructor } from '../interfaces/processed-file-dto-constructor.interface';
import { ClassConstructor, CustomErrorFactory } from '../../../common';
import { FileValidationConfig } from '../../../config/file-validation-config.interface';
import { ConfigStore } from '../../../config';
import { multerErrorHandlerMiddleware } from './multer-error-handler.middleware';
import { Options as MulterOptions } from 'multer';

export const getMulterFileValidationChain = (
    DtoConstructor: ClassConstructor,
    processedFileDtoConstructor: ProcessedFileDtoConstructor,
    fileValidationConfig?: Partial<FileValidationConfig>,
    customErrorFactory?: CustomErrorFactory
): Router => {
    const router = Router();

    const configStore = ConfigStore.getInstance().getConfig();
    const coreConfig = fileValidationConfig?.coreConfig || configStore.fileValidationConfig.coreConfig;

    router.use(
        multerUploadMiddleware(processedFileDtoConstructor, DtoConstructor, coreConfig as MulterOptions),
        multerValidationMiddleware(processedFileDtoConstructor, DtoConstructor, fileValidationConfig),
        multerModificationMiddleware(processedFileDtoConstructor),
        multerErrorHandlerMiddleware(customErrorFactory)
    );

    return router;
};
