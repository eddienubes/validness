import { SingleFileConfiguration } from './single-file-configuration.interface';

/**
 * Multiple files configuration*
 */
export interface MultipleFilesConfiguration extends SingleFileConfiguration {
    /**
     * Max amount of files under the current field. Used when **multiple** is **true**
     */
    maxAmount?: boolean;
}
