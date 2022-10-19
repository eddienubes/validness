import { ValidatorOptions } from 'class-validator';
import { CustomErrorFactory } from '@src';

export type ValidationBodyConfig = ValidatorOptions & { customErrorFactory?: CustomErrorFactory };
