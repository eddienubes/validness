import { SingleFileConfiguration } from './single-file-configuration.interface';

/**
 * Multiple files configuration*
 */
export interface MultipleFilesConfiguration extends SingleFileConfiguration {
    /**
     * Max number of files under the current field.
     */
    maxAmount?: number;
}
