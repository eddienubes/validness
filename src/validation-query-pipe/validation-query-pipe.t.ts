import { ClassConstructor } from '../common/types/types';
import { NextFunction, RequestHandler, Response } from 'express';
import { plainToClass } from '@nestjs/class-transformer';
import { validateOrReject, ValidatorOptions } from '@nestjs/class-validator';
import { ValidationError } from '@nestjs/class-validator';
import { ErrorConstructor } from '../common/types/types';
import { DEFAULT_QUERY_VALIDATOR_CONFIG } from '../common/constants/validator';
import { IConfiguredRequest } from '../common/interfaces/IConfiguratedRequest';
import { findViolatedFields } from '../utils/find-violated-fields';
import { DefaultQueryError } from '../common/models/default-query-error.model';

export const validationQueryPipe = (
  QueryDtoConstructor: ClassConstructor,
  UserCustomError?: ErrorConstructor,
  validatorConfig?: ValidatorOptions): RequestHandler =>
  async (req: IConfiguredRequest, res: Response, next: NextFunction): Promise<void> => {
    const { query } = req;

    const instance = plainToClass(QueryDtoConstructor, query);

    const config = validatorConfig || req.queryValidationConfig || DEFAULT_QUERY_VALIDATOR_CONFIG;

    try {
      await validateOrReject(instance, config);
    } catch (e) {
      const errors = findViolatedFields(e as ValidationError[]);

      return next(UserCustomError ? new UserCustomError(errors) : new DefaultQueryError(errors));
    }

    return next();
  };
