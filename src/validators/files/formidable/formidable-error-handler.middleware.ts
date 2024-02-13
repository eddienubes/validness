import { CustomErrorFactory } from '@src/common/types/types.js';
import { ErrorRequestHandler } from 'express';
import { errors } from 'formidable';
import { ConfigStore } from '@src/config/config-store.js';
import { DefaultFileError } from '@src/validators/files/errors/default-file.error.js';

// @ts-ignore
const FormidableError = errors.default;

export const formidableErrorHandler =
    (customErrorFactory?: CustomErrorFactory): ErrorRequestHandler =>
    async (err, req, res, next) => {
        const globalConfig = ConfigStore.getInstance().getConfig();

        const errorFactory =
            customErrorFactory ||
            globalConfig.customErrorFactory ||
            globalConfig.fileValidationConfig.customErrorFactory;

        // formidable core error differs too much so pass it as is
        if (err instanceof FormidableError) {
            return next(err);
        } else if (err instanceof DefaultFileError) {
            const error = errorFactory
                ? errorFactory(err.fields)
                : new DefaultFileError(err.fields);

            return next(error);
        }

        return next(err);
    };
