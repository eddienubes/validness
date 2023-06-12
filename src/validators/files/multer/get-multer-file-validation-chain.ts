import { Router } from 'express';
import { multerUploadMiddleware } from './multer-upload.middleware';
import { multerValidationMiddleware } from './multer-validation.middleware';
import { multerModificationMiddleware } from './multer-modification.middleware';
import { ProcessedFileDtoConstructor } from '../interfaces/processed-file-dto-constructor.interface';
import { ClassConstructor, ConfigStore, DefaultFileError } from '@src';
import { FileValidationConfig } from '@src/config/file-validation-config.interface';
import { multerErrorHandlerMiddleware } from './multer-error-handler.middleware';
import { Options } from 'multer';
import { FileValidationChainGetter } from '@src/validators/files/multer/types';
import { contentTypeValidationMiddleware } from '@src/validators/content-type-validation.middleware';

export const getMulterFileValidationChain: FileValidationChainGetter = (
    DtoConstructor: ClassConstructor,
    processedFileDtoConstructor: ProcessedFileDtoConstructor,
    fileValidationConfig?: Partial<FileValidationConfig>
): Router => {
    const router = Router();

    const configStore = ConfigStore.getInstance().getConfig();

    const coreConfig = {
        ...((configStore.fileValidationConfig.coreConfig as Options) || {}),
        ...(fileValidationConfig?.coreConfig || {})
    };

    // granular -> global -> default
    const contentTypes =
        fileValidationConfig?.contentTypes ||
        configStore.contentTypes ||
        configStore.fileValidationConfig.contentTypes;

    const customErrorFactory = fileValidationConfig?.customErrorFactory || configStore.customErrorFactory;

    router.use(
        contentTypeValidationMiddleware(contentTypes, DefaultFileError),
        multerUploadMiddleware(DtoConstructor, processedFileDtoConstructor, coreConfig),
        multerValidationMiddleware(processedFileDtoConstructor),
        multerModificationMiddleware(processedFileDtoConstructor),
        multerErrorHandlerMiddleware(customErrorFactory)
    );

    return router;
};
