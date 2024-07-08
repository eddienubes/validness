import { Router } from 'express';
import { FileValidationChainGetter } from '@src/validators/files/multer/types.js';
import { ConfigStore } from '@src/config/config-store.js';
import type { Options } from 'multer';
import { multerUploadMiddleware } from '@src/validators/files/multer/multer-upload.middleware.js';
import { contentTypeValidationMiddleware } from '@src/validators/content-type-validation.middleware.js';
import { multerModificationMiddleware } from '@src/validators/files/multer/multer-modification.middleware.js';
import { multerValidationMiddleware } from '@src/validators/files/multer/multer-validation.middleware.js';
import { multerErrorHandlerMiddleware } from '@src/validators/files/multer/multer-error-handler.middleware.js';
import { ClassConstructor } from '@src/common/interfaces/class-constructor.interface.js';
import { ProcessedFileDtoConstructor } from '@src/validators/files/interfaces/processed-file-dto-constructor.interface.js';
import { FileValidationConfig } from '@src/config/file-validation-config.interface.js';
import { DefaultFileError } from '@src/validators/files/errors/default-file.error.js';
import { ValidationConfigType } from '@src/config/validation-config-type.enum.js';

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
        multerErrorHandlerMiddleware(
            processedFileDtoConstructor,
            fileValidationConfig?.customErrorFactory
        )
    );

    return router;
};
