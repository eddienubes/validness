import { FileValidatorType } from '../common';
import { Options as MulterOptions } from 'multer';
import { ValidatorOptions } from '@nestjs/class-validator';

export interface FileValidationConfig {
    fileValidatorType: FileValidatorType;
    coreConfig?: MulterOptions;

    /**
     * Used for text fields of form data file validation
     */
    textFieldsValidationConfig?: ValidatorOptions;
}
