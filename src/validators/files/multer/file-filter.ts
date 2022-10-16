import { FileFilterCallback } from 'multer';
import { FileValidationMap, MulterFileFilter } from '../types';
import { MIME_TYPE_MAP } from '../constants';
import { MulterFile } from './types';
import { constructDefaultError, isValidMimeType } from '../helpers';

export const fileFilter = (fileValidationMap: FileValidationMap): MulterFileFilter => {
    return (req, file: MulterFile, callback: FileFilterCallback) => {
        const metadata = fileValidationMap[file.fieldname];
        const fileSize = file.size || req.headers['content-length'] || 0;

        // Validation by size
        if (metadata.maxSizeBytes && fileSize > metadata.maxSizeBytes) {
            return callback(
                constructDefaultError(
                    file.fieldname,
                    `The following field contains a file of size ${fileSize} bytes that exceeds the specified maximum limit: ${metadata.maxSizeBytes} bytes`
                )
            );
        }

        if (metadata.minSizeBytes && fileSize < metadata.minSizeBytes) {
            return callback(
                constructDefaultError(
                    file.fieldname,
                    `The following field contains a file of size ${fileSize} bytes that is lower than the specified minimal limit: ${metadata.minSizeBytes} bytes`
                )
            );
        }

        // Validation by a concrete mimetype
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
