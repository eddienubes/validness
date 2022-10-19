import { ErrorRequestHandler } from 'express';
import { DefaultFileError, CustomErrorFactory, ConfigStore } from '@src';
import { errors } from 'formidable';

export const formidableErrorHandler =
    (customErrorFactory?: CustomErrorFactory): ErrorRequestHandler =>
    async (err, req, res, next) => {
        const globalConfig = ConfigStore.getInstance().getConfig();

        const errorFactory = customErrorFactory || globalConfig.customErrorFactory;

        // formidable core error differs too much so pass it as is
        if (err instanceof errors.FormidableError) {
            return next(err);
        } else if (err instanceof DefaultFileError) {
            const error = errorFactory ? errorFactory(err.fields) : new DefaultFileError(err.fields);

            return next(error);
        }

        return next(err);
    };
