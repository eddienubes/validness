import { Router } from 'express';
import { multerUploadMiddleware } from './multer-upload.middleware';
import { multerValidationMiddleware } from './multer-validation.middleware';
import { multerModificationMiddleware } from './multer-modification.middleware';
import { ProcessedFileDtoConstructor } from '../interfaces/processed-file-dto-constructor.interface';
import { ClassConstructor, ConfigStore, DefaultFileError, ValidationConfigType } from '@src';
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

    // Global config is undefined here. Validness() call doesn't make sense
    const coreConfig = {
        ...((configStore.fileValidationConfig.coreConfig as Options) || {}),
        ...(fileValidationConfig?.coreConfig || {})
    };

    router.use(
        contentTypeValidationMiddleware(
            DefaultFileError,
            ValidationConfigType.FILE_VALIDATOR,
            fileValidationConfig
        ),
        multerUploadMiddleware(processedFileDtoConstructor, coreConfig),
        multerValidationMiddleware(DtoConstructor, processedFileDtoConstructor, fileValidationConfig),
        multerModificationMiddleware(processedFileDtoConstructor),
        multerErrorHandlerMiddleware(fileValidationConfig?.customErrorFactory)
    );

    return router;
};
