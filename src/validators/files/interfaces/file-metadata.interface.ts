import { SingleFileConfig } from '@src/validators/files/interfaces/single-file-config.interface.js';
import { MultipleFilesConfig } from '@src/validators/files/interfaces/multiple-files-config.interface.js';

/**
 * Both single file and multiple file configs get merged into one
 * and only file metadata interface with a flag determining "pluralness"
 */
export interface FileMetadata extends SingleFileConfig, MultipleFilesConfig {
    multiple: boolean;
}
