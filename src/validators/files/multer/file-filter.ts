import { FileFilterCallback } from 'multer';
import { FileValidationMap, MulterFileFilter } from '../types';
import { DefaultFileError } from '../errors/default-file.error';
import { MIME_TYPE_MAP } from '../constants';
import { MulterFile } from './types';

export const fileFilter = (fileValidationMap: FileValidationMap): MulterFileFilter => {
    return (req, file: MulterFile, callback: FileFilterCallback) => {
        const metadata = fileValidationMap[file.fieldname];
        const fileSize = file.size || req.headers['content-length'] || 0;

        if (!metadata) {
            return callback(null, true);
        }

        // Validation by size
        if (metadata.maxSizeBytes && fileSize > metadata.maxSizeBytes) {
            return callback(
                constructDefaultError(
                    file.fieldname,
                    `The following field contains file of size ${fileSize} bytes that exceeds the specified limit: ${metadata.maxSizeBytes} bytes`
                )
            );
        }

        // Validation by concrete mimetype
        //  && metadata.mimetype !== file.mimetype
        if (metadata.mimetype && !isValidMimeType(metadata.mimetype, file.mimetype)) {
            return callback(
                constructDefaultError(
                    file.fieldname,
                    `The following field contains file of the invalid mimetype ${file.mimetype}, but expected: ${metadata.mimetype}`
                )
            );
        }

        // Validation by type (basically array of mimetypes)
        if (metadata.type && !MIME_TYPE_MAP[metadata.type].includes(file.mimetype)) {
            return callback(
                constructDefaultError(
                    file.fieldname,
                    `The following field contains file of the invalid mimetype ${
                        file.mimetype
                    }, but expected any of: [${MIME_TYPE_MAP[metadata.type].join(',')}]`
                )
            );
        }

        return callback(null, true);
    };
};

const isValidMimeType = (required: string | string[], actual: string): boolean => {
    if (Array.isArray(required)) {
        return required.includes(actual);
    }

    return required === actual;
};

const constructDefaultError = (name: string, message: string): DefaultFileError =>
    new DefaultFileError([
        {
            field: name,
            violations: [message]
        }
    ]);
