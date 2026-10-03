import { Router } from 'express';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { contentTypeValidationMiddleware } from '../content-type-validation.middleware.ts';
import { ConfigStore } from '../../config/config-store.ts';
import { findViolatedFields } from '../../utils/find-violated-fields.ts';
import { ClassConstructor } from '../../common/interfaces/class-constructor.interface.ts';
import { QueryValidationConfig } from './types.ts';
import { DefaultQueryError } from './errors/default-query.error.ts';
import { ValidationConfigType } from '../../config/validation-config-type.enum.ts';

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

            const validatorConfig =
                queryValidationConfig || globalConfig.queryValidationConfig;

            try {
                await validateOrReject(instance, validatorConfig);

                // Express 5 made req.query a read-only getter, so shadow it: https://expressjs.com/en/guide/migrating-5.html
                Object.defineProperty(req, 'query', {
                    value: instance,
                    writable: true,
                    configurable: true,
                    enumerable: true
                });
            } catch (e) {
                const errors = findViolatedFields(e as ValidationError[]);

                return next(
                    errorFactory
                        ? errorFactory(errors)
                        : new DefaultQueryError(errors, e as ValidationError[])
                );
            }

            return next();
        }
    );

    return router;
};
