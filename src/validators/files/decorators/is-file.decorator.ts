import { FILES_VALIDATION_METADATA_KEY } from '../constants';
import { SingleFileConfiguration } from '../interfaces/single-file-configuration.interface';
import { FilesMetadata } from '../interfaces/files-metadata.interface';

export const IsFile = (config?: SingleFileConfiguration): PropertyDecorator => {
    return (target, propertyKey) => {
        const metadata: FilesMetadata = {
            multiple: false,
            ...config
        };

        Reflect.defineMetadata(FILES_VALIDATION_METADATA_KEY, metadata, target, propertyKey);
    };
};
