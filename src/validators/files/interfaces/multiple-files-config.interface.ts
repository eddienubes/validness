import { SingleFileConfig } from './single-file-config.interface.ts';

/**
 * Multiple files configuration*
 */
export interface MultipleFilesConfig extends SingleFileConfig {
    /**
     * Max number of files under the current field.
     */
    maxAmount?: number;
}
