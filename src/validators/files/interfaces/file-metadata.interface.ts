import { SingleFileConfig } from './single-file-config.interface.ts';
import { MultipleFilesConfig } from './multiple-files-config.interface.ts';

/**
 * Both single file and multiple file configs get merged into one
 * and only file metadata interface with a flag determining "pluralness"
 */
export interface FileMetadata extends SingleFileConfig, MultipleFilesConfig {
    multiple: boolean;
    // name of the decorator
    decorator: string;
}
