import { ValidatorOptions } from 'class-validator';
import { ValidatorConfigurable } from '@src/config/validator-configurable.interface.js';

export type BodyValidationConfig = ValidatorConfigurable & ValidatorOptions;
