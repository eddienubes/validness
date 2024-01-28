import { FILE_VALIDATION_DECORATED_FIELDS_LIST_KEY, FILE_VALIDATION_METADATA_KEY } from '../constants.js';
import { MultipleFilesConfig } from '@src/validators/files/interfaces/multiple-files-config.interface.js';
import { FileMetadata } from '@src/validators/files/interfaces/file-metadata.interface.js';
import { Allow } from 'class-validator';

export const IsFiles = (config?: MultipleFilesConfig): PropertyDecorator => {
    return (target, propertyKey) => {
        const metadata: FileMetadata = {
            multiple: true,
            ...config
        };

        // to keep record of decorated fields
        const list = Reflect.getMetadata(FILE_VALIDATION_DECORATED_FIELDS_LIST_KEY, target) || [];
        Reflect.defineMetadata(FILE_VALIDATION_DECORATED_FIELDS_LIST_KEY, [...list, propertyKey], target);

        Reflect.defineMetadata(FILE_VALIDATION_METADATA_KEY, metadata, target, propertyKey);

        // Since Jan 2024 required by class-validator.
        // Otherwise, it will throw an error because forbidUnknownValues is true by default.
        Allow()(target, propertyKey);
    };
};
