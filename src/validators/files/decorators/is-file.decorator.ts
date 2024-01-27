import { FILE_VALIDATION_DECORATED_FIELDS_LIST_KEY, FILE_VALIDATION_METADATA_KEY } from '../constants.js';
import { SingleFileConfig } from '@src/validators/files/interfaces/single-file-config.interface.js';
import { FileMetadata } from '@src/validators/files/interfaces/file-metadata.interface.js';

export const IsFile = (config?: SingleFileConfig): PropertyDecorator => {
    return (target, propertyKey) => {
        const metadata: FileMetadata = {
            multiple: false,
            ...config
        };

        // to keep record of decorated fields
        const list = Reflect.getMetadata(FILE_VALIDATION_DECORATED_FIELDS_LIST_KEY, target) || [];
        Reflect.defineMetadata(FILE_VALIDATION_DECORATED_FIELDS_LIST_KEY, [...list, propertyKey], target);

        Reflect.defineMetadata(FILE_VALIDATION_METADATA_KEY, metadata, target, propertyKey);
    };
};
