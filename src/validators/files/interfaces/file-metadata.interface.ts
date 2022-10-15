import { SingleFileConfiguration } from './single-file-configuration.interface';
import { MultipleFilesConfiguration } from './multiple-files-configuration.interface';

/**
 * Both single file and multiple file configs get merged into one
 * and only file metadata interface with a flag determining "pluralness"
 */
export interface FileMetadata extends SingleFileConfiguration, MultipleFilesConfiguration {
    multiple: boolean;
}
