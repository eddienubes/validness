import { Router } from 'express';
import { FileValidationChainGetter } from './types.ts';
import { ConfigStore } from '../../../config/config-store.ts';
import type { Options } from 'multer';
import { multerUploadMiddleware } from './multer-upload.middleware.ts';
import { contentTypeValidationMiddleware } from '../../content-type-validation.middleware.ts';
import { multerModificationMiddleware } from './multer-modification.middleware.ts';
import { multerValidationMiddleware } from './multer-validation.middleware.ts';
import { multerErrorHandlerMiddleware } from './multer-error-handler.middleware.ts';
import { ClassConstructor } from '../../../common/interfaces/class-constructor.interface.ts';
import { ProcessedFileDtoConstructor } from '../interfaces/processed-file-dto-constructor.interface.ts';
import { FileValidationConfig } from '../../../config/file-validation-config.interface.ts';
import { DefaultFileError } from '../errors/default-file.error.ts';
import { ValidationConfigType } from '../../../config/validation-config-type.enum.ts';

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
