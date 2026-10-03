import {
    FILE_VALIDATION_DECORATED_FIELDS_LIST_KEY,
    FILE_VALIDATION_METADATA_KEY
} from '../constants.ts';
import { SingleFileConfig } from '../interfaces/single-file-config.interface.ts';
import { FileMetadata } from '../interfaces/file-metadata.interface.ts';
import { Allow } from 'class-validator';

export const IsFile = (config?: SingleFileConfig): PropertyDecorator => {
    return (target, propertyKey) => {
        const metadata: FileMetadata = {
            multiple: false,
            // comply with class-validator naming
            decorator: 'isFile',
            ...config
        };

        // to keep record of decorated fields
        const list =
            Reflect.getMetadata(
                FILE_VALIDATION_DECORATED_FIELDS_LIST_KEY,
                target
            ) || [];
        Reflect.defineMetadata(
            FILE_VALIDATION_DECORATED_FIELDS_LIST_KEY,
            [...list, propertyKey],
            target
        );

        Reflect.defineMetadata(
            FILE_VALIDATION_METADATA_KEY,
            metadata,
            target,
            propertyKey
        );

        // Since Jan 2024 required by class-validator.
        // Otherwise, it will throw an error because forbidUnknownValues is true by default.
        Allow()(target, propertyKey);
    };
};
