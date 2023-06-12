import { Router } from 'express';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { findViolatedFields, ClassConstructor, DefaultQueryError, ConfigStore } from '@src';
import { QueryValidationConfig } from '@src/validators/query/types';
import { contentTypeValidationMiddleware } from '@src/validators/content-type-validation.middleware';

export const validationQueryPipe = (
    QueryDtoConstructor: ClassConstructor,
    queryValidationConfig?: Partial<QueryValidationConfig>
): Router => {
    const router = Router();
    const configStore = ConfigStore.getInstance().getConfig();

    // granular -> global -> default
    const contentTypes =
        queryValidationConfig?.contentTypes ||
        configStore.contentTypes ||
        configStore.queryValidationConfig.contentTypes;

    const errorFactory = queryValidationConfig?.customErrorFactory || configStore.customErrorFactory;

    router.use(
        contentTypeValidationMiddleware(contentTypes, DefaultQueryError, errorFactory),
        async (req, res, next): Promise<void> => {
            const { query } = req;
            const globalConfig = ConfigStore.getInstance().getConfig();

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
