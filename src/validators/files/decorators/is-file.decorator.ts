import { FILE_VALIDATION_METADATA_KEY } from '../constants';
import { SingleFileConfiguration } from '../interfaces/single-file-configuration.interface';
import { FileMetadata } from '../interfaces/file-metadata.interface';

export const IsFile = (config?: SingleFileConfiguration): PropertyDecorator => {
    return (target, propertyKey) => {
        const metadata: FileMetadata = {
            multiple: false,
            ...config
        };

        Reflect.defineMetadata(FILE_VALIDATION_METADATA_KEY, metadata, target, propertyKey);
    };
};
