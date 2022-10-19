import { FileValidatorType } from '@src';
import { Options as MulterOptions } from 'multer';
import { ValidatorOptions } from 'class-validator';
import { Options as FormidableOptions } from 'formidable';

export interface FileValidationConfig {
    /**
     * Type of validator, multer is a default one.
     */
    fileValidatorType: FileValidatorType;

    /**
     * If you wish to modify an underlying library options.
     * CAUTION: Not recommended, unless you change a storage driver.
     * Validation should be persisted on the validness side.
     */
    coreConfig?: MulterOptions | FormidableOptions;

    /**
     * Used for text fields of form data file validation
     */
    textFieldsValidationConfig?: ValidatorOptions;
}
