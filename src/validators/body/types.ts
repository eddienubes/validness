import { ValidatorOptions } from 'class-validator';
import { CustomErrorFactory } from '@src';

export type BodyValidationConfig = {
    customErrorFactory?: CustomErrorFactory;
    /**
     * Allowed content-types.
     * @default ['application/json'] only
     */
    contentTypes: string[];
} & ValidatorOptions;
