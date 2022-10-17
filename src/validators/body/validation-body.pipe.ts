import { plainToClass } from 'class-transformer';
import { validateOrReject, ValidatorOptions, ValidationError } from 'class-validator';
import { findViolatedFields } from '../../utils';
import { CustomErrorFactory } from '../../common';
import { RequestHandler } from 'express';
import { ClassConstructor } from '../../common';
import { DefaultBodyError } from './errors/default-body.error';
import { ConfigStore } from '../../config';

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
