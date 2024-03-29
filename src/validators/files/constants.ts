import { FileValidationChainGetter } from '@src/validators/files/multer/types.js';
import { getMulterFileValidationChain } from '@src/validators/files/multer/get-multer-file-validation-chain.js';
import { getFormidableValidationChain } from '@src/validators/files/formidable/get-formidable-validation-chain.js';
import { FileType } from '@src/validators/files/interfaces/single-file-config.interface.js';
import { FileValidatorType } from '@src/common/enums/file-validator-type.enum.js';

export const FILE_VALIDATION_METADATA_KEY =
    'validness-validation-file-metadata';
export const FILE_VALIDATION_DECORATED_FIELDS_LIST_KEY =
    'validness-validation-decorated-fields-list';

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
export const MIME_TYPE_MAP: Record<FileType, string[]> = {
    audio: [
        'audio/aac',
        'audio/midi',
        'audio/x-midi',
        'audio/mpeg',
        'audio/ogg',
        'audio/opus',
        'audio/wav',
        'audio/webm',
        'audio/3gpp',
        'audio/3gpp2'
    ],
    image: [
        'image/avif',
        'image/bmp',
        'image/gif',
        'image/vnd.microsoft.icon',
        'image/jpeg',
        'image/png',
        'image/svg+xml',
        'image/tiff',
        'image/webp'
    ],
    video: [
        'video/x-msvideo',
        'video/mp4',
        'video/mpeg',
        'video/ogg',
        'video/mp2t',
        'video/webm',
        'video/3gpp',
        'video/3gpp2'
    ]
};
