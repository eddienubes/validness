import { MULTIPLE_FILES_METADATA_KEY } from '../constants';
import { FilesConfiguration } from '../interfaces/files-configuration.interface';

export const IsFiles = (config?: FilesConfiguration): PropertyDecorator => {
    return (target, propertyKey) => {
        Reflect.defineMetadata(MULTIPLE_FILES_METADATA_KEY, config, target, propertyKey);
    };
};
