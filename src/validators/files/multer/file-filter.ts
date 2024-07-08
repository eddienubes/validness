import type { FileFilterCallback } from 'multer';
import {
    FileValidationMap,
    MulterFileFilter
} from '@src/validators/files/types.js';
import { MulterFile } from '@src/validators/files/multer/types.js';
import { isValidMimeType } from '@src/validators/files/helpers.js';
import { MIME_TYPE_MAP } from '@src/validators/files/constants.js';
import { ErrorField } from '@src/common/errors/error-field.js';
import { DefaultFileError } from '@src/validators/files/errors/default-file.error.js';

export const fileFilter = (
    fileValidationMap: FileValidationMap
): MulterFileFilter => {
    return async (req, file: MulterFile, callback: FileFilterCallback) => {
        const metadata = fileValidationMap[file.fieldname];
        const headerSizeStr = req.header('content-length');
        const headerSize = headerSizeStr ? parseInt(headerSizeStr, 10) : null;
        const fileSize = file.size || headerSize || 0;

        // Array of errored fields. Mix of text field violations and file violations.
        const errors: ErrorField[] = [];
        // Array of strings containing violations
        const fileViolations: string[] = [];

        // Validation by size
        if (metadata.maxSizeBytes && fileSize > metadata.maxSizeBytes) {
            fileViolations.push(
                `The following field contains a file of size ${fileSize} bytes that exceeds the specified maximum limit: ${metadata.maxSizeBytes} bytes`
            );
        }

        if (metadata.minSizeBytes && fileSize < metadata.minSizeBytes) {
            fileViolations.push(
                `The following field contains a file of size ${fileSize} bytes that is lower than the specified minimal limit: ${metadata.minSizeBytes} bytes`
            );
        }

        // Validation by a concrete mimetype
        if (
            metadata.mimetype &&
            !isValidMimeType(metadata.mimetype, file.mimetype)
        ) {
            fileViolations.push(
                `The following field contains file of the invalid mimetype ${file.mimetype}, but expected: ${metadata.mimetype}`
            );
        }

        // Validation by type (basically array of mimetypes)
        if (
            metadata.type &&
            !MIME_TYPE_MAP[metadata.type].includes(file.mimetype)
        ) {
            fileViolations.push(
                `The following field contains file of the invalid mimetype ${
                    file.mimetype
                }, but expected any of: [${MIME_TYPE_MAP[metadata.type].join(',')}]`
            );
        }

        // Push new error field if current file violates something
        if (fileViolations.length) {
            const contexts = !!metadata.context
                ? { [metadata.decorator]: metadata.context }
                : {};

            errors.push(
                new ErrorField(file.fieldname, fileViolations, contexts)
            );
        }

        // errors array contains something -> throw
        if (errors.length) {
            return callback(new DefaultFileError(errors));
        }

        return callback(null, true);
    };
};
