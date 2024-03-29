import { RequestHandler } from 'express';
import type { File, Files, Options } from 'formidable';
import { wrapFormidableFileField } from '@src/validators/files/formidable/formidable-validation.middleware.js';
import { FORMIDABLE_DEFAULT_MIMETYPE } from '@src/validators/files/formidable/constants.js';
import { ProcessedFileDtoConstructor } from '@src/validators/files/interfaces/processed-file-dto-constructor.interface.js';
import { ValidatedFile } from '@src/validators/files/interfaces/validated-file.interface.js';

export const formidableModificationMiddleware =
    (
        processedFileDtoConstructor: ProcessedFileDtoConstructor,
        coreConfig: Options
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

        for (const key in processedFileDtoConstructor.fileValidationMap) {
            const fileField = (formidablePayload.files as Files)[key];
            const metadata = processedFileDtoConstructor.fileValidationMap[key];

            const wrappedFile = wrapFormidableFileField(fileField);

            if (!wrappedFile) {
                continue;
            }

            const mappedFiles = mapFormidableFiles(wrappedFile, coreConfig);

            if (metadata.multiple) {
                req.body[key] = mappedFiles;
                continue;
            }

            // contains only 1 element if multiple: false
            req.body[key] = mappedFiles[0];
        }

        // Order of spreading is important here.
        // Formidable validated fields might contain properties conflicting with the actual file fields.
        // E.g. Constructor might have a field named file.
        // The same file field will be present in the instance after validation (class-validator)
        // This happens because plainToInstance() preserves uninitialized fields.
        req.body = {
            ...formidablePayload.validatedFields,
            ...req.body
        };

        // Cleanup the request
        delete req.formidablePayload;

        next();
    };

const mapFormidableFiles = (
    files: File[],
    coreConfig: Options
): ValidatedFile[] =>
    files.map((file) => ({
        originalName: file.originalFilename || undefined, // avoids nulls
        mimeType: file.mimetype || FORMIDABLE_DEFAULT_MIMETYPE,
        sizeBytes: file.size,

        fileName: file.newFilename,
        destination: coreConfig?.uploadDir,
        path: file.filepath
    }));
