import { Router } from 'express';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import {
    ClassConstructor,
    ConfigStore,
    DefaultQueryError,
    findViolatedFields,
    ValidationConfigType
} from '@src';
import { QueryValidationConfig } from '@src/validators/query/types';
import { contentTypeValidationMiddleware } from '@src/validators/content-type-validation.middleware';

export const validationQueryPipe = (
    QueryDtoConstructor: ClassConstructor,
    queryValidationConfig?: Partial<QueryValidationConfig>
): Router => {
    const router = Router();

    router.use(
        contentTypeValidationMiddleware(
            DefaultQueryError,
            ValidationConfigType.QUERY_VALIDATOR,
            queryValidationConfig
        ),
        async (req, res, next): Promise<void> => {
            const { query } = req;
            const globalConfig = ConfigStore.getInstance().getConfig();

            const errorFactory =
                queryValidationConfig?.customErrorFactory ||
                globalConfig.customErrorFactory ||
                globalConfig.queryValidationConfig.customErrorFactory;

            const instance = plainToInstance(QueryDtoConstructor, query);

            const validatorConfig = queryValidationConfig || globalConfig.queryValidationConfig;

            try {
                await validateOrReject(instance, validatorConfig);

                req.query = instance;
            } catch (e) {
                const errors = findViolatedFields(e as ValidationError[]);

                return next(errorFactory ? errorFactory(errors) : new DefaultQueryError(errors));
            }

            return next();
        }
    );

    return router;
};
