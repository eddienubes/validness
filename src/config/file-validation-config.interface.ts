import { FileValidatorType } from '../common';
import { Options as MulterOptions } from 'multer';

export interface FileValidationConfig {
    coreValidationFileType: FileValidatorType;
    coreConfig?: MulterOptions;
}
