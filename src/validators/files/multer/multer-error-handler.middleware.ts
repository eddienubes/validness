import { ErrorRequestHandler } from 'express';
import {
    DefaultFileError,
    CustomErrorFactory,
    ErrorField
} from '@src/index.js';
import { ConfigStore } from '@src/config/config-store.js';
import { loadMulter } from '@src/validators/files/multer/multerLoader.js';
import type { MulterError } from 'multer';

export const multerErrorHandlerMiddleware = (
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
            const errorFields = mapMulterErrorToErrorFields(err);
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
    multerError: MulterError
): ErrorField[] => {
    const field = multerError.field || 'unknown';

    return [
        new ErrorField(multerError.field || 'unknown', [
            `The following file field [${field}] has exceeded its maxCount or is not expected`
        ])
    ];
};
