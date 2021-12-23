import { ClassConstructor } from '../common/types/types';
import { NextFunction, RequestHandler, Response } from 'express';
import { plainToClass } from '@nestjs/class-transformer';
import { validateOrReject, ValidatorOptions } from '@nestjs/class-validator';
import { findViolatedBodyFields } from './implementation/find-violated-body-fields.impl';
import { ValidationError } from '@nestjs/class-validator';
import { ErrorConstructor } from '../common/types/types';
import { DefaultBodyErrorModel } from './models/default-body-error.model';
import { DEFAULT_BODY_VALIDATOR_CONFIG } from '../common/constants/validator';
import { IConfiguredRequest } from '../common/interfaces/IConfiguratedRequest';

export const validationBodyPipe = (
  DtoConstructor: ClassConstructor,
  UserCustomError?: ErrorConstructor,
  validatorConfig?: ValidatorOptions): RequestHandler =>
  async (req: IConfiguredRequest, res: Response, next: NextFunction): Promise<void> => {
    const { body } = req;

    const instance = plainToClass(DtoConstructor, body);

    const config = validatorConfig || req.bodyValidationConfig || DEFAULT_BODY_VALIDATOR_CONFIG;

    try {
      await validateOrReject(instance, config);
    } catch (e) {
      const errors = findViolatedBodyFields(e as ValidationError[]);

      return next(UserCustomError ? new UserCustomError(errors) : new DefaultBodyErrorModel(errors));
    }

    return next();
  };
