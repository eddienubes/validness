import { Router } from 'express';
import {
    ClassConstructor,
    DefaultFileError,
    FileValidationConfig,
    ProcessedFileDtoConstructor,
    ValidationConfigType
} from '@src/index.js';
import { FileValidationChainGetter } from '@src/validators/files/multer/types.js';
import { ConfigStore } from '@src/config/config-store.js';
import { Options } from 'multer';
import { multerUploadMiddleware } from '@src/validators/files/multer/multer-upload.middleware.js';
import { contentTypeValidationMiddleware } from '@src/validators/content-type-validation.middleware.js';
import { multerModificationMiddleware } from '@src/validators/files/multer/multer-modification.middleware.js';
import { multerValidationMiddleware } from '@src/validators/files/multer/multer-validation.middleware.js';
import { multerErrorHandlerMiddleware } from '@src/validators/files/multer/multer-error-handler.middleware.js';

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
        multerValidationMiddleware(
            DtoConstructor,
            processedFileDtoConstructor,
            fileValidationConfig
        ),
        multerModificationMiddleware(processedFileDtoConstructor),
        multerErrorHandlerMiddleware(fileValidationConfig?.customErrorFactory)
    );

    return router;
};
