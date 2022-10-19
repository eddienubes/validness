import { plainToClass } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { findViolatedFields, ClassConstructor, DefaultBodyError, ConfigStore } from '@src';
import { RequestHandler } from 'express';
import { ValidationBodyConfig } from '@src/validators/body/types';

/**
 * Validates body of an incoming request.
 * Body parser is required beforehand.
 * @param DtoConstructor
 * @param config
 */
export const validationBodyPipe =
    (DtoConstructor: ClassConstructor, config?: ValidationBodyConfig): RequestHandler =>
    async (req, res, next): Promise<void> => {
        const { body } = req;
        const globalConfig = ConfigStore.getInstance().getConfig();

        const instance = plainToClass(DtoConstructor, body);

        const validatorConfig = config || globalConfig.bodyValidationConfig;

        try {
            await validateOrReject(instance, validatorConfig);

            req.body = instance;
        } catch (e) {
            const errors = findViolatedFields(e as ValidationError[]);
            const errorFactory = config?.customErrorFactory || globalConfig.customErrorFactory;

            return next(errorFactory ? errorFactory(errors) : new DefaultBodyError(errors));
        }

        return next();
    };
