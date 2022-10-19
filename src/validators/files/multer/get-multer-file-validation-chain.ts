import { Router } from 'express';
import { multerUploadMiddleware } from './multer-upload.middleware';
import { multerValidationMiddleware } from './multer-validation.middleware';
import { multerModificationMiddleware } from './multer-modification.middleware';
import { ProcessedFileDtoConstructor } from '../interfaces/processed-file-dto-constructor.interface';
import { ClassConstructor, CustomErrorFactory, ConfigStore } from '@src';
import { FileValidationConfig } from '@src/config/file-validation-config.interface';
import { multerErrorHandlerMiddleware } from './multer-error-handler.middleware';
import { Options } from 'multer';

export const getMulterFileValidationChain = (
    DtoConstructor: ClassConstructor,
    processedFileDtoConstructor: ProcessedFileDtoConstructor,
    fileValidationConfig?: Partial<FileValidationConfig>,
    customErrorFactory?: CustomErrorFactory
): Router => {
    const router = Router();

    const configStore = ConfigStore.getInstance().getConfig();

    const coreConfig = {
        ...((configStore.fileValidationConfig.coreConfig as Options) || {}),
        ...(fileValidationConfig?.coreConfig || {})
    };

    router.use(
        multerUploadMiddleware(DtoConstructor, processedFileDtoConstructor, coreConfig),
        multerValidationMiddleware(processedFileDtoConstructor),
        multerModificationMiddleware(processedFileDtoConstructor),
        multerErrorHandlerMiddleware(customErrorFactory)
    );

    return router;
};
