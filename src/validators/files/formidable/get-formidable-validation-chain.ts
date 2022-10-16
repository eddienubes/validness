import { Router } from 'express';
import { ClassConstructor, CustomErrorFactory } from '../../../common';
import { ProcessedFileDtoConstructor } from '../interfaces/processed-file-dto-constructor.interface';
import { FileValidationConfig } from '../../../config/file-validation-config.interface';
import { formidableUploadMiddleware } from './formidable-upload.middleware';
import { ConfigStore } from '../../../config';
import { Options } from 'formidable';
import { formidableValidationMiddleware } from './formidable-validation.middleware';
import { formidableModificationMiddleware } from './formidable-modification.middleware';

export const getFormidableValidationChain = (
    DtoConstructor: ClassConstructor,
    processedFileDtoConstructor: ProcessedFileDtoConstructor,
    fileValidationConfig?: Partial<FileValidationConfig>,
    customErrorFactory?: CustomErrorFactory
): Router => {
    const router = Router();

    const configStore = ConfigStore.getInstance().getConfig();
    const coreConfig = fileValidationConfig?.coreConfig || configStore.fileValidationConfig.coreConfig;

    router.use(
        formidableUploadMiddleware(coreConfig as Options),
        formidableValidationMiddleware(processedFileDtoConstructor, DtoConstructor, fileValidationConfig),
        formidableModificationMiddleware(processedFileDtoConstructor, coreConfig as Options)
    );

    return router;
};
