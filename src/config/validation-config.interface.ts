import { ValidatorOptions } from 'class-validator';
import { CustomErrorFactory } from '../common';
import { FileValidatorType } from '../common';
import { FileValidationConfig } from './file-validation-config.interface';

export interface ValidationConfig {
    [key: string]: ValidatorOptions | CustomErrorFactory | FileValidatorType | undefined | FileValidationConfig;

    /**
     * class-validator config for query pipe
     */
    queryValidationConfig: ValidatorOptions;

    /**
     * class-validator config for body pipe
     */
    bodyValidationConfig: ValidatorOptions;

    /**
     * Global error factory
     */
    customErrorFactory?: CustomErrorFactory;

    /**
     * File validation config
     */
    fileValidationConfig: FileValidationConfig;
}
