import { ValidatorOptions } from 'class-validator';
import { CustomErrorFactory } from '@src';

export type QueryValidationConfig = {
    customErrorFactory?: CustomErrorFactory;
    /**
     * Allowed content-types.
     * @default ['application/json', 'multipart/form-data'] only
     */
    contentTypes: string[];
} & ValidatorOptions;
