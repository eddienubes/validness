import { RequestHandler } from 'express';
import { ProcessedFileDtoConstructor } from '../interfaces/processed-file-dto-constructor.interface';
import { ClassConstructor, ErrorField } from '../../../common';
import { ConfigStore } from '../../../config';
import { FileValidationConfig } from '../../../config/file-validation-config.interface';
import { isValidMimeType, isValidTextFields } from '../helpers';
import { FileMetadata } from '../interfaces/file-metadata.interface';
import { File } from 'formidable';
import { MIME_TYPE_MAP } from '../constants';
import { DefaultFileError } from '../errors/default-file.error';

export const formidableValidationMiddleware =
    (
        processedFileDtoConstructor: ProcessedFileDtoConstructor,
        DtoConstructor: ClassConstructor,
        fileValidationConfig?: Partial<FileValidationConfig>
    ): RequestHandler =>
    async (req, res, next) => {
        const formidablePayload = req.formidablePayload;
        if (!formidablePayload) {
            return next(
                new Error(
                    `Formidable result was not defined for some reason, please notify developer of validness about this error. It's not supposed to happen`
                )
            );
        }

        const { error: formidableError, fields, files } = formidablePayload;
        if (formidableError) {
            return next(formidableError);
        }

        const errors: ErrorField[] = [];

        // Text fields validation, basically repeats body or query validation
        const globalConfig = ConfigStore.getInstance().getConfig();
        const validationConfig =
            fileValidationConfig?.textFieldsValidationConfig ||
            globalConfig.fileValidationConfig.textFieldsValidationConfig;

        const { violatedFields, instance } = await isValidTextFields(DtoConstructor, fields, validationConfig);
        errors.push(...violatedFields);

        // File validation
        for (const key in processedFileDtoConstructor.fileValidationMap) {
            const metadata = processedFileDtoConstructor.fileValidationMap[key];

            const fileField = files[key];

            if (Array.isArray(fileField)) {
                const errorField = validateFileField(fileField, metadata, key);
                !errorField || errors.push(errorField);
                continue;
            }

            const errorField = validateFileField([fileField], metadata, key);
            !errorField || errors.push(errorField);
        }

        if (errors.length) {
            next(new DefaultFileError(errors));
        }

        req.formidablePayload = {
            files,
            fields: instance, // remap fields body to an instance of class-transformer
            error: formidableError
        };

        next();
    };

/**
 * This function validates each form-data field
 * that might contain either array or a single file object.
 * @param files
 * @param metadata
 * @param fieldName
 */
const validateFileField = (files: File[] | undefined, metadata: FileMetadata, fieldName: string): ErrorField | null => {
    // Reused and cleared for every file
    const violations: string[] = [];

    // if field is not defined and is optional
    if (!files && metadata.optional) {
        return null;
    }

    // if field is not defined, but required
    if (!files && !metadata.optional) {
        return new ErrorField(fieldName, [`File field [${fieldName}] is required, but was not defined`]);
    }

    if (files && metadata.maxAmount && files.length > metadata.maxAmount) {
        return new ErrorField(fieldName, [
            `The following file field [${fieldName}] has exceeded its maxCount or is not expected`
        ]);
    }

    // if field is defined validate each file in its array
    for (const file of files as File[]) {
        // Validation by size
        if (metadata.maxSizeBytes && file.size > metadata.maxSizeBytes) {
            violations.push(
                `The following field contains a file of size ${file.size} bytes that exceeds the specified maximum limit: ${metadata.maxSizeBytes} bytes`
            );
        }

        if (metadata.minSizeBytes && file.size < metadata.minSizeBytes) {
            violations.push(
                `The following field contains a file of size ${file.size} bytes that is lower than the specified minimal limit: ${metadata.minSizeBytes} bytes`
            );
        }

        // Validation by a concrete mimetype
        if (metadata.mimetype && file.mimetype && !isValidMimeType(metadata.mimetype, file.mimetype)) {
            violations.push(
                `The following field contains file of the invalid mimetype ${file.mimetype}, but expected: ${metadata.mimetype}`
            );
        }

        // Validation by type (basically array of mimetypes)
        if (metadata.type && file.mimetype && !MIME_TYPE_MAP[metadata.type].includes(file.mimetype)) {
            violations.push(
                `The following field contains file of the invalid mimetype ${
                    file.mimetype
                }, but expected any of: [${MIME_TYPE_MAP[metadata.type].join(',')}]`
            );
        }
    }

    if (violations.length) {
        return new ErrorField(fieldName, violations);
    }

    return null;
};
