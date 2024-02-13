import { RequestHandler } from 'express';
import {
    ClassConstructor,
    ErrorField,
    DefaultFileError,
    ProcessedFileDtoConstructor,
    FileValidationConfig,
    FileMetadata,
    AnyObject
} from '@src/index.js';
import { Fields, File, Files } from 'formidable';
import * as fs from 'node:fs/promises';
import { ConfigStore } from '@src/config/config-store.js';
import {
    isValidMimeType,
    isValidTextFields
} from '@src/validators/files/helpers.js';
import { MIME_TYPE_MAP } from '@src/validators/files/constants.js';

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

        // We ignore internal errors and do validation by ourselves
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

        // we're sure fields are defined here
        const unwrappedFields = unwrapIfSingleTextField(fields as Fields);
        const { violatedFields, instance } = await isValidTextFields(
            DtoConstructor,
            unwrappedFields,
            processedFileDtoConstructor.fileValidationMap,
            validationConfig
        );
        errors.push(...violatedFields);

        // File validation
        for (const key in processedFileDtoConstructor.fileValidationMap) {
            const metadata = processedFileDtoConstructor.fileValidationMap[key];

            const fileField = (files as Files)[key];

            // can be array and can be undefined
            const wrappedFileField = wrapFormidableFileField(fileField);
            const errorField = validateFileField(
                wrappedFileField,
                metadata,
                key
            );

            if (errorField) {
                errors.push(errorField);
            }
        }

        // For cases where upload directory is specified
        if (errors.length) {
            await removeFormidableUploadedFiles(files as Files);
            next(new DefaultFileError(errors));
        }

        req.formidablePayload = {
            files,
            error: formidableError,
            validatedFields: instance // remap fields body to an instance of class-transformer
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
const validateFileField = (
    files: File[] | null,
    metadata: FileMetadata,
    fieldName: string
): ErrorField | null => {
    // Reused and cleared for every file
    const violations: string[] = [];

    // if field is not defined and is optional
    if (!files && metadata.optional) {
        return null;
    }

    // if field is not defined, but required
    if (!files && !metadata.optional) {
        return new ErrorField(fieldName, [
            `The following file field: [${fieldName}] is empty, but required`
        ]);
    }

    if (files && metadata.maxAmount && files.length > metadata.maxAmount) {
        return new ErrorField(fieldName, [
            `The following file field [${fieldName}] has exceeded its maxCount or is not expected`
        ]);
    }

    if (files && !metadata.multiple && files.length > 1) {
        return new ErrorField(fieldName, [
            `The following file field [${fieldName}] has exceeded its maxCount (1) or is not expected`
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
        if (
            metadata.mimetype &&
            file.mimetype &&
            !isValidMimeType(metadata.mimetype, file.mimetype)
        ) {
            violations.push(
                `The following field contains file of the invalid mimetype ${file.mimetype}, but expected: ${metadata.mimetype}`
            );
        }

        // Validation by type (basically array of mimetypes)
        if (
            metadata.type &&
            file.mimetype &&
            !MIME_TYPE_MAP[metadata.type].includes(file.mimetype)
        ) {
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

export const removeFormidableUploadedFiles = async (
    files: Files
): Promise<void> => {
    const promises: Promise<void>[] = [];

    for (const key in files) {
        const file = files[key];

        const wrappedFile = wrapFormidableFileField(file);

        if (!wrappedFile) return;

        wrappedFile.map((file) => {
            if (file.filepath) {
                promises.push(fs.unlink(file.filepath));
            }
        });
    }

    await Promise.all(promises);
};

// wrapped represents a single field that might contain multiple files
export const wrapFormidableFileField = (
    file: File | File[] | undefined
): File[] | null => {
    if (Array.isArray(file)) {
        return file;
    }

    return !!file ? [file] : null;
};

export const unwrapIfSingleTextField = (fields: Fields): AnyObject => {
    const unwrappedFields: AnyObject = {};

    for (const key in fields) {
        const value = fields[key];

        if (Array.isArray(value) && value.length === 1) {
            unwrappedFields[key] = value[0];
        } else {
            unwrappedFields[key] = value;
        }
    }

    return unwrappedFields;
};
