import { Request } from 'express';
import { ValidatorOptions } from '@nestjs/class-validator';

export interface IConfiguredRequest extends Request {
  queryValidationConfig?: ValidatorOptions,
  bodyValidationConfig?: ValidatorOptions
}