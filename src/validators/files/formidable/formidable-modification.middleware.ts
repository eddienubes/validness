import { RequestHandler } from 'express';
import { ProcessedFileDtoConstructor } from '../interfaces/processed-file-dto-constructor.interface';
import { File, Options } from 'formidable';
import { ValidatedFile } from '../interfaces/validated-file.interface';
import { FORMIDABLE_DEFAULT_MIMETYPE } from './constants';
import { wrapFormidableFileField } from './formidable-validation.middleware';

export const formidableModificationMiddleware =
    (processedFileDtoConstructor: ProcessedFileDtoConstructor, coreConfig: Options): RequestHandler =>
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
            const fileField = formidablePayload.files[key];
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

        req.body = {
            ...req.body,
            ...formidablePayload.fields
        };

        next();
    };

const mapFormidableFiles = (files: File[], coreConfig: Options): ValidatedFile[] =>
    files.map((file) => ({
        originalName: file.originalFilename || undefined, // avoids nulls
        mimeType: file.mimetype || FORMIDABLE_DEFAULT_MIMETYPE,
        sizeBytes: file.size,

        fileName: file.newFilename,
        destination: coreConfig?.uploadDir,
        path: file.filepath
    }));