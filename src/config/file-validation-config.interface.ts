import { Options as MulterOptions } from 'multer';
import { ValidatorOptions } from 'class-validator';
import { Options as FormidableOptions } from 'formidable';
import { ValidatorConfigurable } from '@src/config/validator-configurable.interface.js';
import { FileValidatorType } from '@src/common/enums/file-validator-type.enum.js';

/**
 * Order of configs precedence:
 * 1. Local within the pipe itself.
 * 2. Default (or overridden by user with a validness() call)
 */
export interface FileValidationConfig extends ValidatorConfigurable {
    /**
     * Type of validator, multer is a default one.
     */
    fileValidatorType: FileValidatorType;

    /**
     * If you wish to modify the underlying library options.
     * CAUTION 1: Not recommended unless you want to change the storage driver.
     * Validation should be persisted on the validness side.
     *
     * CAUTION 2: Global config doesn't work in conjunction with local.
     * (settings within validness(config.coreConfig) call VS
     * validation<Name>Pipe(config.coreConfig)) -> the former doesn't have ANY effect.
     * So, if you set coreConfig via validness() call, it won't affect the actual multer middleware factory.
     */
    coreConfig: MulterOptions | FormidableOptions;

    /**
     * Used for text fields of form data file validation
     */
    textFieldsValidationConfig?: ValidatorOptions;
}
