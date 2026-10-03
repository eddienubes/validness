import { ValidatorOptions } from 'class-validator';
import { CustomErrorFactory } from '../common/types/types.ts';
import { FileValidatorType } from '../common/enums/file-validator-type.enum.ts';
import { FileValidationConfig } from './file-validation-config.interface.ts';
import { QueryValidationConfig } from '../validators/query/types.ts';
import { BodyValidationConfig } from '../validators/body/types.ts';

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
