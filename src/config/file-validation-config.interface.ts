import { CustomErrorFactory, FileValidatorType } from '@src';
import { Options as MulterOptions } from 'multer';
import { ValidatorOptions } from 'class-validator';
import { Options as FormidableOptions } from 'formidable';
import { ValidatorConfigurable } from '@src/config/validator-configurable.interface';

export interface FileValidationConfig extends ValidatorConfigurable {
    /**
     * Type of validator, multer is a default one.
     */
    fileValidatorType: FileValidatorType;

    /**
     * If you wish to modify the underlying library options.
     * CAUTION 1: Not recommended unless you change a storage driver.
     * Validation should be persisted on the validness side.
     *
     * CAUTION 2: Global config doesn't work in conjunction with local.
     * So, if you set coreConfig via validness() call, it won't affect the actual multer middleware factory.
     */
    coreConfig: MulterOptions | FormidableOptions;

    /**
     * Used for text fields of form data file validation
     */
    textFieldsValidationConfig?: ValidatorOptions;
}
