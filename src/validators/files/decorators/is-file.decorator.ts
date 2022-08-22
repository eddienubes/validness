import { FILE_VALIDATION_DECORATED_FIELDS_LIST_KEY, FILE_VALIDATION_METADATA_KEY } from '../constants';
import { SingleFileConfiguration } from '../interfaces/single-file-configuration.interface';
import { FileMetadata } from '../interfaces/file-metadata.interface';

export const IsFile = (config?: SingleFileConfiguration): PropertyDecorator => {
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
