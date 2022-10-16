import { RequestHandler } from 'express';
import { ProcessedFileDtoConstructor } from '../interfaces/processed-file-dto-constructor.interface';
import { ClassConstructor, ErrorField } from '../../../common';
import { DefaultFileError } from '../errors/default-file.error';
import { MulterFile } from './types';
import { plainToClass } from '@nestjs/class-transformer';
import { validate } from '@nestjs/class-validator';
import { ConfigStore } from '../../../config';
import { FileValidationConfig } from '../../../config/file-validation-config.interface';
import { findViolatedFields } from '../../../utils';

/**
 * Some validation logic preserved on upload stage by multer itself.
 * Here we just extend it.
 * @param processedFileDtoConstructor
 * @param DtoConstructor
 * @param fileValidationConfig
 */
export const multerValidationMiddleware = (
    processedFileDtoConstructor: ProcessedFileDtoConstructor,
    DtoConstructor: ClassConstructor,
    fileValidationConfig?: Partial<FileValidationConfig>
): RequestHandler => {
    console.log(
        'multerValidationMiddleware CLOSED with: ',
        DtoConstructor.name,
        processedFileDtoConstructor.multerFields
    );
    return async (req, res, next) => {
        console.log(
            'multerValidationMiddleware CALLED with: ',
            DtoConstructor.name,
            processedFileDtoConstructor.multerFields
        );
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

        // Text fields validation, basically repeats body or query validation
        const globalConfig = ConfigStore.getInstance().getConfig();
        const instance = plainToClass(DtoConstructor, req.body);
        const textFieldsValidationConfig =
            fileValidationConfig?.textFieldsValidationConfig ||
            globalConfig.fileValidationConfig.textFieldsValidationConfig;

        const textFieldsErrors = await validate(instance, textFieldsValidationConfig);
        const violatedFields = findViolatedFields(textFieldsErrors);

        errors.push(...violatedFields);

        if (errors.length) {
            return next(new DefaultFileError(errors));
        }

        next();
    };
};
