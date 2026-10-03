import { ErrorRequestHandler } from 'express';
import { ConfigStore } from '../../../config/config-store.ts';
import { loadMulter } from './multerLoader.ts';
import type { MulterError } from 'multer';
import { CustomErrorFactory } from '../../../common/types/types.ts';
import { DefaultFileError } from '../errors/default-file.error.ts';
import { ErrorField } from '../../../common/errors/error-field.ts';
import { ProcessedFileDtoConstructor } from '../interfaces/processed-file-dto-constructor.interface.ts';
import { FileMetadata } from '../interfaces/file-metadata.interface.ts';

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
