import { CustomErrorFactory } from '../../../common/types/types.ts';
import { ErrorRequestHandler } from 'express';
import { ConfigStore } from '../../../config/config-store.ts';
import { DefaultFileError } from '../errors/default-file.error.ts';
import { loadFormidable } from './formidableLoader.ts';

export const formidableErrorHandler = (
    customErrorFactory?: CustomErrorFactory
): ErrorRequestHandler => {
    const formidable = loadFormidable();
    const FormidableError = formidable.errors.default;

    return async (err, req, res, next) => {
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
};
