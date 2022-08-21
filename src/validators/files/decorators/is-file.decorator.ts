import { SINGLE_FILE_METADATA_KEY } from '../constants';
import { FileConfiguration } from '../interfaces/file-configuration.interface';

export const IsFile = (config?: FileConfiguration): PropertyDecorator => {
    return (target, propertyKey) => {
        Reflect.defineMetadata(SINGLE_FILE_METADATA_KEY, config, target, propertyKey);
    };
};
