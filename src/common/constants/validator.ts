import { ValidatorOptions } from '@nestjs/class-validator';

export const DEFAULT_BODY_VALIDATOR_CONFIG: ValidatorOptions = {
  forbidNonWhitelisted: true
};

export const DEFAULT_QUERY_VALIDATOR_CONFIG: ValidatorOptions = {
  forbidNonWhitelisted: true
};