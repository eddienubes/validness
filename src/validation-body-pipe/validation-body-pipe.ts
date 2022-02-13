import { NextFunction, RequestHandler, Response } from 'express';
import { plainToClass } from '@nestjs/class-transformer';
import { validateOrReject, ValidatorOptions } from '@nestjs/class-validator';
import { findViolatedFields } from '../utils/find-violated-fields';
import { ValidationError } from '@nestjs/class-validator';
import { DefaultBodyErrorModel } from '../common/models/default-body-error.model';
import { DEFAULT_BODY_VALIDATOR_CONFIG } from '../common/constants/validator';
import { ConfiguredRequest } from '../common/interfaces/ConfiguratedRequest';
import { ClassConstructor } from '../common/models/class-constructor.model';
import { UserCustomError } from '../common/models/user-custom-error.model';

export const validationBodyPipe =
    (DtoConstructor: ClassConstructor, UserError?: typeof UserCustomError, validatorConfig?: ValidatorOptions): RequestHandler =>
    async (req: ConfiguredRequest, res: Response, next: NextFunction): Promise<void> => {
        const { body } = req;

        const instance = plainToClass(DtoConstructor, body);

        const config = validatorConfig || req.bodyValidationConfig || DEFAULT_BODY_VALIDATOR_CONFIG;

        try {
            await validateOrReject(instance, config);

            req.body = instance;
        } catch (e) {
            const errors = findViolatedFields(e as ValidationError[]);

            return next(UserError ? new UserError(errors) : new DefaultBodyErrorModel(errors));
        }

        return next();
    };
