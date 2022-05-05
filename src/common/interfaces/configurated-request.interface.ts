import { Request } from 'express';
import { ValidatorOptions } from '@nestjs/class-validator';

export interface ConfiguredRequest extends Request {
    queryValidationConfig?: ValidatorOptions;
    bodyValidationConfig?: ValidatorOptions;
}
