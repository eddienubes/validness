import { RequestHandler } from 'express';
import { ProcessedFileDtoConstructor } from '../interfaces/processed-file-dto-constructor.interface';
import { ErrorField } from '../../../common';
import { DefaultFileError } from '../errors/default-file.error';

export const multerValidationMiddleware = (processedFileDtoConstructor: ProcessedFileDtoConstructor): RequestHandler => {
    return (req, res, next) => {
        const errors: ErrorField[] = [];

        for (const key in processedFileDtoConstructor.fileValidationMap) {
            const typedKey = key as keyof typeof req.files;

            const metadata = processedFileDtoConstructor.fileValidationMap[key];
            const file = req?.files?.[typedKey];

            if (!file && !metadata.optional) {
                errors.push({
                    field: key,
                    violations: [`The following file field: [${key}] is empty`]
                });
            }
        }

        if (errors.length) {
            return next(new DefaultFileError(errors));
        }
    };
};
