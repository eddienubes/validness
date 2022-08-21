import { FileConfiguration } from './file-configuration.interface';

/**
 * Multiple files configuration*
 */
export interface FilesConfiguration extends FileConfiguration {
    /**
     * Max amount of files under the current field. Used when **multiple** is **true**
     */
    maxAmount?: boolean;
}
