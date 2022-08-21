import { MultipleFilesConfiguration } from '../interfaces/multiple-files-configuration.interface';
import { FilesMetadata } from '../interfaces/files-metadata.interface';
import { FILES_VALIDATION_METADATA_KEY } from '../constants';

export const IsFiles = (config?: MultipleFilesConfiguration): PropertyDecorator => {
    return (target, propertyKey) => {
        const metadata: FilesMetadata = {
            multiple: true,
            ...config
        };

        Reflect.defineMetadata(FILES_VALIDATION_METADATA_KEY, metadata, target, propertyKey);
    };
};
