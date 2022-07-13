import { RequestHandler } from 'express';
import { plainToClass } from '@nestjs/class-transformer';
import { validateOrReject, ValidatorOptions } from '@nestjs/class-validator';
import { ValidationError } from '@nestjs/class-validator';
import { DEFAULT_QUERY_VALIDATOR_CONFIG } from '../common/constants/validator';
import { findViolatedFields } from '../utils/find-violated-fields';
import { DefaultQueryError } from './models/default-query-error.model';
import { ClassConstructor } from '../common/models/class-constructor.model';
import { CustomErrorFactory } from '../common/types/types';

export const validationQueryPipe =
    (
        QueryDtoConstructor: ClassConstructor,
        customErrorFactory?: CustomErrorFactory,
        validatorConfig?: ValidatorOptions
    ): RequestHandler =>
    async (req, res, next): Promise<void> => {
        const { query } = req;

        const instance = plainToClass(QueryDtoConstructor, query);

        const config = validatorConfig || req.queryValidationConfig || DEFAULT_QUERY_VALIDATOR_CONFIG;

        try {
            await validateOrReject(instance, config);

            req.query = instance;
        } catch (e) {
            const errors = findViolatedFields(e as ValidationError[]);

            return next(customErrorFactory ? customErrorFactory(errors) : new DefaultQueryError(errors));
        }

        return next();
    };
