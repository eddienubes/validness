import { ErrorRequestHandler } from 'express';
import { MulterError } from 'multer';
import { DefaultFileError, CustomErrorFactory, ErrorField, ConfigStore } from '@src';

export const multerErrorHandlerMiddleware =
    (customErrorFactory?: CustomErrorFactory): ErrorRequestHandler =>
    async (err, req, res, next) => {
        const globalConfig = ConfigStore.getInstance().getConfig();

        const errorFactory = customErrorFactory || globalConfig.customErrorFactory;

        if (err instanceof MulterError) {
            const errorFields = mapMulterErrorToErrorFields(err);
            const error = errorFactory ? errorFactory(errorFields) : new DefaultFileError(errorFields);

            return next(error);
        } else if (err instanceof DefaultFileError) {
            const error = errorFactory ? errorFactory(err.fields) : new DefaultFileError(err.fields);

            return next(error);
        }

        return next(err);
    };

const mapMulterErrorToErrorFields = (multerError: MulterError): ErrorField[] => {
    const field = multerError.field || 'unknown';

    return [
        new ErrorField(multerError.field || 'unknown', [
            `The following file field [${field}] has exceeded its maxCount or is not expected`
        ])
    ];
};
