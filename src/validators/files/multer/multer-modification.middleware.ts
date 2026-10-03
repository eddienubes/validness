import { RequestHandler } from 'express';
import { MulterFile } from './types.ts';
import { ProcessedFileDtoConstructor } from '../interfaces/processed-file-dto-constructor.interface.ts';
import { ValidatedFile } from '../interfaces/validated-file.interface.ts';

/**
 * Processes files and body to concatenate them into a single object
 * @param processedFileDtoConstructor
 */
export const multerModificationMiddleware = (
    processedFileDtoConstructor: ProcessedFileDtoConstructor
): RequestHandler => {
    return async (req, res, next) => {
        // Express 5 no longer defaults req.body to {}
        req.body ??= {};

        for (const key in processedFileDtoConstructor.fileValidationMap) {
            const typedKey = key as keyof typeof req.files;

            const metadata = processedFileDtoConstructor.fileValidationMap[key];

            // We are certain it's a multer file because we use .fields method.
            // See http://expressjs.com/en/resources/middleware/multer.html
            const files = req?.files?.[typedKey] as unknown as MulterFile[];

            // if file is not optional but still not defined, this is BAD, because such cases
            // should be handled in the validation level of file filter
            if ((!files || !files?.length) && !metadata.optional) {
                return next(
                    new Error(
                        `You have encountered an unexpected validness package error. If you see this message please create an issue or somehow notify the developer about it`
                    )
                );
            }

            // if a file is optional and not defined, there is nothing to modify, skip it.
            if (!files?.length && metadata.optional) {
                continue;
            }

            const mappedFiles = mapMulterFiles(files);

            if (metadata.multiple) {
                req.body[key] = mappedFiles;
                continue;
            }

            // if multiple is false array should contain only one file
            req.body[key] = mappedFiles[0];
        }

        next();
    };
};

const mapMulterFiles = (files: MulterFile[]): ValidatedFile[] =>
    files.map((file) => ({
        originalName: file.originalname,
        mimeType: file.mimetype,
        buffer: file.buffer,
        sizeBytes: file.size,

        fileName: file.filename,
        destination: file.destination,
        path: file.path
    }));
