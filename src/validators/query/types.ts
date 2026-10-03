import { ValidatorOptions } from 'class-validator';
import { ValidatorConfigurable } from '../../config/validator-configurable.interface.ts';

export type QueryValidationConfig = ValidatorConfigurable & ValidatorOptions;
