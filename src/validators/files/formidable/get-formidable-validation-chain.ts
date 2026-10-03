import { Router } from 'express';
import type { Options } from 'formidable';
import { FileValidationChainGetter } from '../multer/types.ts';
import { ConfigStore } from '../../../config/config-store.ts';
import { contentTypeValidationMiddleware } from '../../content-type-validation.middleware.ts';
import { formidableUploadMiddleware } from './formidable-upload.middleware.ts';
import { formidableValidationMiddleware } from './formidable-validation.middleware.ts';
import { formidableModificationMiddleware } from './formidable-modification.middleware.ts';
import { formidableErrorHandler } from './formidable-error-handler.middleware.ts';
import { ClassConstructor } from '../../../common/interfaces/class-constructor.interface.ts';
import { ProcessedFileDtoConstructor } from '../interfaces/processed-file-dto-constructor.interface.ts';
import { FileValidationConfig } from '../../../config/file-validation-config.interface.ts';
import { DefaultFileError } from '../errors/default-file.error.ts';
import { ValidationConfigType } from '../../../config/validation-config-type.enum.ts';

export const getFormidableValidationChain: FileValidationChainGetter = (
    DtoConstructor: ClassConstructor,
    processedFileDtoConstructor: ProcessedFileDtoConstructor,
    fileValidationConfig?: Partial<FileValidationConfig>
): Router => {
    const router = Router();
    const configStore = ConfigStore.getInstance().getConfig();

    const coreConfig: Options = {
        ...(configStore.fileValidationConfig.coreConfig as Options),
        ...fileValidationConfig?.coreConfig
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
