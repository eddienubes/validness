import { MultipleFilesConfiguration } from '../interfaces/multiple-files-configuration.interface';
import { FileMetadata } from '../interfaces/file-metadata.interface';
import { FILE_VALIDATION_METADATA_KEY } from '../constants';

export const IsFiles = (config?: MultipleFilesConfiguration): PropertyDecorator => {
    return (target, propertyKey) => {
        const metadata: FileMetadata = {
            multiple: true,
            ...config
        };

        Reflect.defineMetadata(FILE_VALIDATION_METADATA_KEY, metadata, target, propertyKey);
    };
};
