import { ClassConstructor } from '../common/types/types';
import { NextFunction, Response } from 'express';
import { plainToClass } from '@nestjs/class-transformer';
import { validateOrReject, ValidatorOptions } from '@nestjs/class-validator';
import { findViolatedBodyFields } from './implementation/find-violated-body-fields.impl';
import { ValidationError } from '@nestjs/class-validator';
import { ErrorConstructor } from '../common/types/types';
import { DefaultBodyError } from './models/default-body.error';
import { DEFAULT_BODY_VALIDATOR_CONFIG } from './constants/validator';
import { IConfiguredRequest } from '../common/interfaces/IConfiguratedRequest';

export const validationBodyPipe = (
  DtoConstructor: ClassConstructor,
  UserCustomError?: ErrorConstructor,
  validatorConfig?: ValidatorOptions) =>
  async (req: IConfiguredRequest, res: Response, next: NextFunction): Promise<void> => {

    const body = req.body;
    const instance = plainToClass(DtoConstructor, body);

    const config = validatorConfig || req.bodyValidationConfig || DEFAULT_BODY_VALIDATOR_CONFIG;

    try {
      await validateOrReject(instance, config);
    } catch (e) {
      const errors = findViolatedBodyFields(e as ValidationError[]);

      return next(UserCustomError ? new UserCustomError(errors) : new DefaultBodyError(errors));
    }

    return next();
  };
