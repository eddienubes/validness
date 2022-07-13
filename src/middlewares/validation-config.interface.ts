import { ValidatorOptions } from '@nestjs/class-validator';
import { CustomErrorFactory } from '../common/types/types';

export interface ValidationConfig {
    [key: string]: CustomErrorFactory | ValidatorOptions | undefined;

    queryValidationConfig?: ValidatorOptions;
    bodyValidationConfig?: ValidatorOptions;
    customErrorFactory?: CustomErrorFactory;
}
