import { RequestHandler } from 'express';
import { plainToClass } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { findViolatedFields, ClassConstructor, DefaultQueryError, ConfigStore } from '@src';
import { ValidationQueryConfig } from '@src/validators/query/types';

export const validationQueryPipe =
    (QueryDtoConstructor: ClassConstructor, config?: ValidationQueryConfig): RequestHandler =>
    async (req, res, next): Promise<void> => {
        const { query } = req;
        const globalConfig = ConfigStore.getInstance().getConfig();

        const instance = plainToClass(QueryDtoConstructor, query);

        const validatorConfig = config || globalConfig.queryValidationConfig;

        try {
            await validateOrReject(instance, validatorConfig);

            req.query = instance;
        } catch (e) {
            const errors = findViolatedFields(e as ValidationError[]);
            const errorFactory = config?.customErrorFactory || globalConfig.customErrorFactory;

            return next(errorFactory ? errorFactory(errors) : new DefaultQueryError(errors));
        }

        return next();
    };
