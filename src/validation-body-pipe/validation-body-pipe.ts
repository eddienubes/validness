import { plainToClass } from '@nestjs/class-transformer';
import { validateOrReject, ValidatorOptions } from '@nestjs/class-validator';
import { findViolatedFields } from '../utils/find-violated-fields';
import { ValidationError } from '@nestjs/class-validator';
import { DefaultBodyError } from '../common/models/default-body-error.model';
import { DEFAULT_BODY_VALIDATOR_CONFIG } from '../common/constants/validator';
import { ClassConstructor } from '../common/models/class-constructor.model';
import { CustomErrorFactory } from '../common/types/types';
import { RequestHandler } from 'express';

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

            return next(customErrorFactory ? customErrorFactory(errors) : new DefaultBodyError(errors));
        }

        return next();
    };
