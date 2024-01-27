import { ValidatorOptions } from 'class-validator';
import { CustomErrorFactory } from '@src/common/types/types.js';
import { FileValidatorType } from '@src/common/enums/file-validator-type.enum.js';
import { FileValidationConfig } from '@src/config/file-validation-config.interface.js';
import { QueryValidationConfig } from '@src/validators/query/types.js';
import { BodyValidationConfig } from '@src/validators/body/types.js';

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
