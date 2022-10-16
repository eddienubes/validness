import { ValidatorOptions } from '@nestjs/class-validator';
import { CustomErrorFactory } from '../common';
import { FileValidatorType } from '../common';
import { FileValidationConfig } from './file-validation-config.interface';

export interface ValidationConfig {
    [key: string]: ValidatorOptions | CustomErrorFactory | FileValidatorType | undefined | FileValidationConfig;

    queryValidationConfig: ValidatorOptions;
    bodyValidationConfig: ValidatorOptions;
    customErrorFactory?: CustomErrorFactory;

    fileValidationConfig: FileValidationConfig;
}
