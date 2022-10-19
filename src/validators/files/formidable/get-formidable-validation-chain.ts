import { Router } from 'express';
import { ClassConstructor, CustomErrorFactory, ConfigStore } from '@src';
import { ProcessedFileDtoConstructor } from '../interfaces/processed-file-dto-constructor.interface';
import { FileValidationConfig } from '@src/config/file-validation-config.interface';
import { formidableUploadMiddleware } from './formidable-upload.middleware';
import { Options } from 'formidable';
import { formidableValidationMiddleware } from './formidable-validation.middleware';
import { formidableModificationMiddleware } from './formidable-modification.middleware';
import { formidableErrorHandler } from './formidable-error-handler.middleware';

export const getFormidableValidationChain = (
    DtoConstructor: ClassConstructor,
    processedFileDtoConstructor: ProcessedFileDtoConstructor,
    fileValidationConfig?: Partial<FileValidationConfig>,
    customErrorFactory?: CustomErrorFactory
): Router => {
    const router = Router();
    const configStore = ConfigStore.getInstance().getConfig();

    const coreConfig: Options = {
        ...((configStore.fileValidationConfig.coreConfig as Options) || {}),
        ...(fileValidationConfig?.coreConfig || {})
    };

    router.use(
        formidableUploadMiddleware(coreConfig),
        formidableValidationMiddleware(processedFileDtoConstructor, DtoConstructor, fileValidationConfig),
        formidableModificationMiddleware(processedFileDtoConstructor, coreConfig),
        formidableErrorHandler(customErrorFactory)
    );

    return router;
};
