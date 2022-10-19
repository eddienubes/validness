import { ValidatorOptions } from 'class-validator';
import { CustomErrorFactory } from '@src';

export type ValidationQueryConfig = ValidatorOptions & { customErrorFactory?: CustomErrorFactory };
