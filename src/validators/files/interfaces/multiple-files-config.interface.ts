import { SingleFileConfig } from '@src/validators/files/interfaces/single-file-config.interface.js';

/**
 * Multiple files configuration*
 */
export interface MultipleFilesConfig extends SingleFileConfig {
    /**
     * Max number of files under the current field.
     */
    maxAmount?: number;
}
