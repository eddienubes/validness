import { FileFilterCallback } from 'multer';
import { FileValidationMap, MulterFileFilter } from '../types';
import { DefaultFileError } from '../errors/default-file.error';
import { MIME_TYPE_MAP } from '../constants';
import { MulterFile } from './types';

export const fileFilter = (fileValidationMap: FileValidationMap): MulterFileFilter => {
    return (req, file: MulterFile, callback: FileFilterCallback) => {
        const metadata = fileValidationMap[file.fieldname];

        if (!metadata) {
            return callback(null, true);
        }

        // Validation by size
        if (metadata.maxSizeBytes && file.size > metadata.maxSizeBytes) {
            return callback(
                constructDefaultError(
                    file.fieldname,
                    `The following field contains file of size ${file.size} bytes that exceeds the specified limit: ${metadata.maxSizeBytes} bytes`
                )
            );
        }

        // Validation by concrete mimetype
        if (metadata.mimetype && metadata.mimetype !== file.mimetype) {
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

const constructDefaultError = (name: string, message: string): DefaultFileError =>
    new DefaultFileError([
        {
            field: name,
            violations: [message]
        }
    ]);
