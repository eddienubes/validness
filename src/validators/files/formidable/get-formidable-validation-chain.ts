import { Router } from 'express';
import { Options } from 'formidable';
import { FileValidationChainGetter } from '@src/validators/files/multer/types.js';
import {
    ClassConstructor,
    DefaultFileError,
    FileValidationConfig,
    ProcessedFileDtoConstructor,
    ValidationConfigType
} from '@src/index.js';
import { ConfigStore } from '@src/config/config-store.js';
import { contentTypeValidationMiddleware } from '@src/validators/content-type-validation.middleware.js';
import { formidableUploadMiddleware } from '@src/validators/files/formidable/formidable-upload.middleware.js';
import { formidableValidationMiddleware } from '@src/validators/files/formidable/formidable-validation.middleware.js';
import { formidableModificationMiddleware } from '@src/validators/files/formidable/formidable-modification.middleware.js';
import { formidableErrorHandler } from '@src/validators/files/formidable/formidable-error-handler.middleware.js';

export const getFormidableValidationChain: FileValidationChainGetter = (
    DtoConstructor: ClassConstructor,
    processedFileDtoConstructor: ProcessedFileDtoConstructor,
    fileValidationConfig?: Partial<FileValidationConfig>
): Router => {
    const router = Router();
    const configStore = ConfigStore.getInstance().getConfig();

    const coreConfig: Options = {
        ...((configStore.fileValidationConfig.coreConfig as Options) || {}),
        ...(fileValidationConfig?.coreConfig || {})
    };

    router.use(
        contentTypeValidationMiddleware(
            DefaultFileError,
            ValidationConfigType.FILE_VALIDATOR,
            fileValidationConfig
        ),
        formidableUploadMiddleware(coreConfig),
        formidableValidationMiddleware(processedFileDtoConstructor, DtoConstructor, fileValidationConfig),
        formidableModificationMiddleware(processedFileDtoConstructor, coreConfig),
        formidableErrorHandler(fileValidationConfig?.customErrorFactory)
    );

    return router;
};
