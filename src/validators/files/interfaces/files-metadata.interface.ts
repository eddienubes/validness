import { SingleFileConfiguration } from './single-file-configuration.interface';
import { MultipleFilesConfiguration } from './multiple-files-configuration.interface';

export interface FilesMetadata extends SingleFileConfiguration, MultipleFilesConfiguration {
    multiple: boolean;
}
