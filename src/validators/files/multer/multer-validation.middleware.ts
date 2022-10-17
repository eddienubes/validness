import { RequestHandler } from 'express';
import { ProcessedFileDtoConstructor } from '../interfaces/processed-file-dto-constructor.interface';
import { ErrorField } from '../../../common';
import { DefaultFileError } from '../errors/default-file.error';
import { MulterFile } from './types';

/**
 * Some validation logic preserved on upload stage by multer itself.
 * Here we just extend it.
 * @param processedFileDtoConstructor
 */
export const multerValidationMiddleware = (
    processedFileDtoConstructor: ProcessedFileDtoConstructor
): RequestHandler => {
    return async (req, res, next) => {
        const errors: ErrorField[] = [];

        // Extended file validation
        for (const key in processedFileDtoConstructor.fileValidationMap) {
            const typedKey = key as keyof typeof req.files;

            const metadata = processedFileDtoConstructor.fileValidationMap[key];

            // We are certainly sure it's a multer file because we use .fields method.
            // See http://expressjs.com/en/resources/middleware/multer.html
            const files = req?.files?.[typedKey] as unknown as MulterFile[];

            // if field is not defined and required or is empty and required
            if ((!files || !files?.length) && !metadata.optional) {
                errors.push({
                    field: key,
                    violations: [`The following file field: [${key}] is empty, but required`]
                });
            }
        }

        if (errors.length) {
            return next(new DefaultFileError(errors));
        }

        next();
    };
};
