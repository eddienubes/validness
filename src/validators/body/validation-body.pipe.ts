import { plainToClass } from 'class-transformer';
import { validateOrReject, ValidatorOptions, ValidationError } from 'class-validator';
import { findViolatedFields, CustomErrorFactory, ClassConstructor, DefaultBodyError, ConfigStore } from '@src';
import { RequestHandler } from 'express';

export const validationBodyPipe =
    (
        DtoConstructor: ClassConstructor,
        customErrorFactory?: CustomErrorFactory,
        validatorConfig?: ValidatorOptions
    ): RequestHandler =>
    async (req, res, next): Promise<void> => {
        const { body } = req;
        const globalConfig = ConfigStore.getInstance().getConfig();

        const instance = plainToClass(DtoConstructor, body);

        const config = validatorConfig || globalConfig.bodyValidationConfig;

        try {
            await validateOrReject(instance, config);

            req.body = instance;
        } catch (e) {
            const errors = findViolatedFields(e as ValidationError[]);
            const errorFactory = customErrorFactory || globalConfig.customErrorFactory;

            return next(errorFactory ? errorFactory(errors) : new DefaultBodyError(errors));
        }

        return next();
    };
