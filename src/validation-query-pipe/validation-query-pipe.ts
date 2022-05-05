import { NextFunction, RequestHandler, Response } from 'express';
import { plainToClass } from '@nestjs/class-transformer';
import { validateOrReject, ValidatorOptions } from '@nestjs/class-validator';
import { ValidationError } from '@nestjs/class-validator';
import { DEFAULT_QUERY_VALIDATOR_CONFIG } from '../common/constants/validator';
import { findViolatedFields } from '../utils/find-violated-fields';
import { DefaultQueryError } from '../common/models/default-query-error.model';
import { ConfiguredRequest } from '../common/interfaces/configurated-request.interface';
import { ClassConstructor } from '../common/models/class-constructor.model';
import { UserCustomError } from '../common/models/user-custom-error.model';

export const validationQueryPipe =
    (
        QueryDtoConstructor: ClassConstructor,
        UserError?: typeof UserCustomError,
        validatorConfig?: ValidatorOptions
    ): RequestHandler =>
    async (req: ConfiguredRequest, res: Response, next: NextFunction): Promise<void> => {
        const { query } = req;

        const instance = plainToClass(QueryDtoConstructor, query);

        const config = validatorConfig || req.queryValidationConfig || DEFAULT_QUERY_VALIDATOR_CONFIG;

        try {
            await validateOrReject(instance, config);

            req.query = instance;
        } catch (e) {
            const errors = findViolatedFields(e as ValidationError[]);

            return next(UserError ? new UserError(errors) : new DefaultQueryError(errors));
        }

        return next();
    };
