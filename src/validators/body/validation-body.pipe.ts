import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { findViolatedFields, ClassConstructor, DefaultBodyError, ConfigStore } from '@src';
import { Router } from 'express';
import { BodyValidationConfig } from '@src/validators/body/types';
import { contentTypeValidationMiddleware } from '@src/validators/content-type-validation.middleware';

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
    const configStore = ConfigStore.getInstance().getConfig();

    // granular -> global -> default
    const contentTypes =
        bodyValidationConfig?.contentTypes ||
        configStore.contentTypes ||
        configStore.bodyValidationConfig.contentTypes;

    const errorFactory = bodyValidationConfig?.customErrorFactory || configStore.customErrorFactory;

    router.use(
        contentTypeValidationMiddleware(contentTypes, DefaultBodyError, errorFactory),
        async (req, res, next) => {
            const { body } = req;

            const instance = plainToInstance(DtoConstructor, body);

            const validatorConfig = bodyValidationConfig || configStore.bodyValidationConfig;

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
