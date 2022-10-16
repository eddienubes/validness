import { RequestHandler } from 'express';
import { plainToClass } from 'class-transformer';
import { validateOrReject, ValidatorOptions } from 'class-validator';
import { ValidationError } from 'class-validator';
import { findViolatedFields } from '../../utils';
import { CustomErrorFactory } from '../../common';
import { ClassConstructor } from '../../common';
import { DefaultQueryError } from './errors/default-query.error';
import { ConfigStore } from '../../config';

export const validationQueryPipe =
    (
        QueryDtoConstructor: ClassConstructor,
        customErrorFactory?: CustomErrorFactory,
        validatorConfig?: ValidatorOptions
    ): RequestHandler =>
    async (req, res, next): Promise<void> => {
        const { query } = req;
        const globalConfig = ConfigStore.getInstance().getConfig();

        const instance = plainToClass(QueryDtoConstructor, query);

        const config = validatorConfig || globalConfig.queryValidationConfig;

        try {
            await validateOrReject(instance, config);

            req.query = instance;
        } catch (e) {
            const errors = findViolatedFields(e as ValidationError[]);
            const errorFactory = customErrorFactory || globalConfig.customErrorFactory;

            return next(errorFactory ? errorFactory(errors) : new DefaultQueryError(errors));
        }

        return next();
    };
