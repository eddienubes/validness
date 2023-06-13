import { Router } from 'express';
import { ClassConstructor, ConfigStore, DefaultFileError, ValidationConfigType } from '@src';
import { ProcessedFileDtoConstructor } from '../interfaces/processed-file-dto-constructor.interface';
import { FileValidationConfig } from '@src/config/file-validation-config.interface';
import { formidableUploadMiddleware } from './formidable-upload.middleware';
import { Options } from 'formidable';
import { formidableValidationMiddleware } from './formidable-validation.middleware';
import { formidableModificationMiddleware } from './formidable-modification.middleware';
import { formidableErrorHandler } from './formidable-error-handler.middleware';
import { FileValidationChainGetter } from '@src/validators/files/multer/types';
import { contentTypeValidationMiddleware } from '@src/validators/content-type-validation.middleware';

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
