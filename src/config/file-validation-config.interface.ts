import { FileValidatorType } from '../common';
import { Options as MulterOptions } from 'multer';
import { ValidatorOptions } from 'class-validator';
import { Options as FormidableOptions } from 'formidable';

export interface FileValidationConfig {
    fileValidatorType: FileValidatorType;
    coreConfig?: MulterOptions | FormidableOptions;

    /**
     * Used for text fields of form data file validation
     */
    textFieldsValidationConfig?: ValidatorOptions;
}
