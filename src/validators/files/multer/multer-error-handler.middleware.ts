import { ErrorRequestHandler } from 'express';
import { ConfigStore } from '@src/config/config-store.js';
import { loadMulter } from '@src/validators/files/multer/multerLoader.js';
import type { MulterError } from 'multer';
import { CustomErrorFactory } from '@src/common/types/types.js';
import { DefaultFileError } from '@src/validators/files/errors/default-file.error.js';
import { ErrorField } from '@src/common/errors/error-field.js';
import { ProcessedFileDtoConstructor } from '@src/validators/files/interfaces/processed-file-dto-constructor.interface.js';
import { FileMetadata } from '@src/validators/files/interfaces/file-metadata.interface.js';

export const multerErrorHandlerMiddleware = (
    processedFileDtoConstructor: ProcessedFileDtoConstructor,
    customErrorFactory?: CustomErrorFactory
): ErrorRequestHandler => {
    const multer = loadMulter();

    return async (err, req, res, next) => {
        const configStore = ConfigStore.getInstance();
        const globalConfig = configStore.getConfig();

        const errorFactory =
            customErrorFactory ||
            globalConfig.customErrorFactory ||
            globalConfig.fileValidationConfig.customErrorFactory;

        if (err instanceof multer.MulterError) {
            const errorFields = mapMulterErrorToErrorFields(
                processedFileDtoConstructor,
                err
            );
            const error = errorFactory
                ? errorFactory(errorFields)
                : new DefaultFileError(errorFields);

            return next(error);
        } else if (err instanceof DefaultFileError) {
            const error = errorFactory
                ? errorFactory(err.fields)
                : new DefaultFileError(err.fields);

            return next(error);
        }

        return next(err);
    };
};

const mapMulterErrorToErrorFields = (
    processedFileDtoConstructor: ProcessedFileDtoConstructor,
    multerError: MulterError
): ErrorField[] => {
    const field = multerError.field || 'unknown';

    const metadata: FileMetadata | undefined =
        processedFileDtoConstructor.fileValidationMap[field];

    return [
        new ErrorField(
            multerError.field || 'unknown',
            [
                `The following file field [${field}] has exceeded its maxCount or is not expected`
            ],
            metadata?.context
        )
    ];
};
