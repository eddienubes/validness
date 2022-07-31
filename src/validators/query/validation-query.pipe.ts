import { RequestHandler } from 'express';
import { plainToClass } from '@nestjs/class-transformer';
import { validateOrReject, ValidatorOptions } from '@nestjs/class-validator';
import { ValidationError } from '@nestjs/class-validator';
import { DEFAULT_QUERY_VALIDATOR_CONFIG } from '../../common/constants/validator';
import { findViolatedFields } from '../../utils/find-violated-fields';
import { CustomErrorFactory } from '../../common/types/types';
import { ClassConstructor } from '../../common/interfaces';
import { DefaultQueryError } from './errors/default-query.error';

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
            const errorFactory = customErrorFactory || req.customErrorFactory;

            return next(errorFactory ? errorFactory(errors) : new DefaultQueryError(errors));
        }

        return next();
    };
