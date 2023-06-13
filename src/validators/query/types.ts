import { ValidatorOptions } from 'class-validator';
import { ValidatorConfigurable } from '@src/config/validator-configurable.interface';

export type QueryValidationConfig = ValidatorConfigurable & ValidatorOptions;
