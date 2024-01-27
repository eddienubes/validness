import { ValidatorOptions } from 'class-validator';
import { CustomErrorFactory, FileValidatorType } from '@src';
import { FileValidationConfig } from './file-validation-config.interface';
import { BodyValidationConfig } from '@src/validators/body/types';
import { QueryValidationConfig } from '@src/validators/query/types';

export interface ValidationConfig {
    [key: string]:
        | ValidatorOptions
        | CustomErrorFactory
        | FileValidatorType
        | undefined
        | FileValidationConfig
        | QueryValidationConfig
        | BodyValidationConfig
        | string[];

    /**
     * class-validator config for query pipe
     */
    queryValidationConfig: QueryValidationConfig;

    /**
     * class-validator config for body pipe
     */
    bodyValidationConfig: BodyValidationConfig;

    /**
     * Global error factory
     */
    customErrorFactory?: CustomErrorFactory;

    /**
     * Allowed content-types.
     * @default ['application/json', 'multipart/form-data'] only
     */
    contentTypes?: string[];

    /**
     * File validation config
     */
    fileValidationConfig: FileValidationConfig;
}
