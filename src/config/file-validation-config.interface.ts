import { FileValidatorType } from '../common';
import { Options } from 'multer';

export interface FileValidationConfig {
    coreValidationFileType?: FileValidatorType;
    coreConfig?: Options;
}
