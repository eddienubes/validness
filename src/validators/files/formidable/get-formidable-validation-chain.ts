import { Router } from 'express';
import type { Options } from 'formidable';
import { FileValidationChainGetter } from '@src/validators/files/multer/types.js';
import { ConfigStore } from '@src/config/config-store.js';
import { contentTypeValidationMiddleware } from '@src/validators/content-type-validation.middleware.js';
import { formidableUploadMiddleware } from '@src/validators/files/formidable/formidable-upload.middleware.js';
import { formidableValidationMiddleware } from '@src/validators/files/formidable/formidable-validation.middleware.js';
import { formidableModificationMiddleware } from '@src/validators/files/formidable/formidable-modification.middleware.js';
import { formidableErrorHandler } from '@src/validators/files/formidable/formidable-error-handler.middleware.js';
import { ClassConstructor } from '@src/common/interfaces/class-constructor.interface.js';
import { ProcessedFileDtoConstructor } from '@src/validators/files/interfaces/processed-file-dto-constructor.interface.js';
import { FileValidationConfig } from '@src/config/file-validation-config.interface.js';
import { DefaultFileError } from '@src/validators/files/errors/default-file.error.js';
import { ValidationConfigType } from '@src/config/validation-config-type.enum.js';

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
        formidableValidationMiddleware(
            processedFileDtoConstructor,
            DtoConstructor,
            fileValidationConfig
        ),
        formidableModificationMiddleware(
            processedFileDtoConstructor,
            coreConfig
        ),
        formidableErrorHandler(fileValidationConfig?.customErrorFactory)
    );

    return router;
};
