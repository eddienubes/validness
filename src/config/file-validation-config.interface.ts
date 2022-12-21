import { FileValidatorType } from '@src';
import { ValidatorOptions } from 'class-validator';
import type { Options as FormidableOptions } from 'formidable';
import type { Options as MulterOptions } from 'multer';

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
