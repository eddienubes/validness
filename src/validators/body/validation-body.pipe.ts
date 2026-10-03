import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { Router } from 'express';
import { ClassConstructor } from '../../common/interfaces/class-constructor.interface.ts';
import { BodyValidationConfig } from './types.ts';
import { contentTypeValidationMiddleware } from '../content-type-validation.middleware.ts';
import { DefaultBodyError } from './errors/default-body.error.ts';
import { ValidationConfigType } from '../../config/validation-config-type.enum.ts';
import { ConfigStore } from '../../config/config-store.ts';
import { findViolatedFields } from '../../utils/find-violated-fields.ts';
import { ValidnessError } from '../../common/errors/validness.error.ts';

/**
 * Validates the body of an incoming request.
 * Body parser is required beforehand.
 * @param DtoConstructor
 * @param bodyValidationConfig
 */
export const validationBodyPipe = (
    DtoConstructor: ClassConstructor,
    bodyValidationConfig?: Partial<BodyValidationConfig>
): Router => {
    const router = Router();

    router.use(
        contentTypeValidationMiddleware(
            DefaultBodyError,
            ValidationConfigType.BODY_VALIDATOR,
            bodyValidationConfig
        ),
        async (req, res, next) => {
            const { body } = req;

            if (!body) {
                return next(
                    new ValidnessError(
                        'Unable to validate since body is not defined, please apply body parser middleware before this one.'
                    )
                );
            }

            const configStore = ConfigStore.getInstance();
            const globalConfig = configStore.getConfig();

            const instance = plainToInstance(DtoConstructor, body);

            const validatorConfig =
                bodyValidationConfig || globalConfig.bodyValidationConfig;
            const errorFactory =
                bodyValidationConfig?.customErrorFactory ||
                globalConfig.customErrorFactory ||
                globalConfig.bodyValidationConfig.customErrorFactory;

            try {
                await validateOrReject(instance, validatorConfig);

                req.body = instance;
            } catch (e) {
                const errors = findViolatedFields(e as ValidationError[]);

                return next(
                    errorFactory
                        ? errorFactory(errors)
                        : new DefaultBodyError(errors, e as ValidationError[])
                );
            }

            return next();
        }
    );

    return router;
};
