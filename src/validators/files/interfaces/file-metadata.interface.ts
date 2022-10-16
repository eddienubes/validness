import { SingleFileConfig } from './single-file-config.interface';
import { MultipleFilesConfig } from './multiple-files-config.interface';

/**
 * Both single file and multiple file configs get merged into one
 * and only file metadata interface with a flag determining "pluralness"
 */
export interface FileMetadata extends SingleFileConfig, MultipleFilesConfig {
    multiple: boolean;
}
