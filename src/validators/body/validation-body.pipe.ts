import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { Router } from 'express';
import { ClassConstructor } from '@src/common/interfaces/class-constructor.interface.js';
import { BodyValidationConfig } from '@src/validators/body/types.js';
import { contentTypeValidationMiddleware } from '@src/validators/content-type-validation.middleware.js';
import { DefaultBodyError } from '@src/validators/body/errors/default-body.error.js';
import { ValidationConfigType } from '@src/config/validation-config-type.enum.js';
import { ConfigStore } from '@src/config/config-store.js';
import { findViolatedFields } from '@src/utils/find-violated-fields.js';

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
            const configStore = ConfigStore.getInstance();
            const globalConfig = configStore.getConfig();

            const instance = plainToInstance(DtoConstructor, body);

            const validatorConfig = bodyValidationConfig || globalConfig.bodyValidationConfig;
            const errorFactory =
                bodyValidationConfig?.customErrorFactory ||
                globalConfig.customErrorFactory ||
                globalConfig.bodyValidationConfig.customErrorFactory;

            try {
                await validateOrReject(instance, validatorConfig);

                req.body = instance;
            } catch (e) {
                const errors = findViolatedFields(e as ValidationError[]);

                return next(errorFactory ? errorFactory(errors) : new DefaultBodyError(errors));
            }

            return next();
        }
    );

    return router;
};
