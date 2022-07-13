import { plainToClass } from '@nestjs/class-transformer';
import { validateOrReject, ValidatorOptions } from '@nestjs/class-validator';
import { findViolatedFields } from '../utils/find-violated-fields';
import { ValidationError } from '@nestjs/class-validator';
import { DEFAULT_BODY_VALIDATOR_CONFIG } from '../common/constants/validator';
import { CustomErrorFactory } from '../common/types/types';
import { RequestHandler } from 'express';
import { ClassConstructor } from '../common/interfaces';
import { DefaultBodyError } from './errors/default-body.error';

export const validationBodyPipe =
    (
        DtoConstructor: ClassConstructor,
        customErrorFactory?: CustomErrorFactory,
        validatorConfig?: ValidatorOptions
    ): RequestHandler =>
    async (req, res, next): Promise<void> => {
        const { body } = req;

        const instance = plainToClass(DtoConstructor, body);

        const config = validatorConfig || req.bodyValidationConfig || DEFAULT_BODY_VALIDATOR_CONFIG;

        try {
            await validateOrReject(instance, config);

            req.body = instance;
        } catch (e) {
            const errors = findViolatedFields(e as ValidationError[]);
            const errorFactory = customErrorFactory || req.customErrorFactory;

            return next(errorFactory ? errorFactory(errors) : new DefaultBodyError(errors));
        }

        return next();
    };
