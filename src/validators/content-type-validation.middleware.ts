import { RequestHandler } from 'express';
import { ConfigStore } from '../config/config-store.ts';
import { ClassConstructor } from '../common/interfaces/class-constructor.interface.ts';
import { ValidationErrorsCollectable } from '../common/interfaces/validation-errors-collectable.interface.ts';
import { ValidationConfigType } from '../config/validation-config-type.enum.ts';
import { ValidatorConfigurable } from '../config/validator-configurable.interface.ts';
import { ErrorField } from '../common/errors/error-field.ts';

export const contentTypeValidationMiddleware = (
    ErrorConstructor: ClassConstructor<ValidationErrorsCollectable>,
    type: ValidationConfigType,
    localConfig?: Partial<ValidatorConfigurable>
): RequestHandler => {
    return (req, res, next) => {
        const configStore = ConfigStore.getInstance();
        const globalConfig = configStore.getConfig();
        const validatorConfig = configStore.getByValidatorType(type);

        // local -> global -> default
        const allowedContentTypes =
            localConfig?.contentTypes ||
            globalConfig.contentTypes ||
            validatorConfig.contentTypes;

        const errorFactory =
            localConfig?.customErrorFactory ||
            globalConfig.customErrorFactory ||
            validatorConfig.customErrorFactory;

        const contentType = req.headers['content-type'];

        if (!allowedContentTypes.length) {
            next();
            return;
        }

        if (!contentType) {
            const error = errorFactory
                ? errorFactory([
                      new ErrorField('Content-Type header', [
                          'Content-Type header should be present'
                      ])
                  ])
                : new ErrorConstructor([
                      {
                          field: 'Content-Type header',
                          violations: ['Content-Type header should be present']
                      }
                  ]);

            next(error);
            return;
        }

        if (!allowedContentTypes.some((ct) => contentType.includes(ct))) {
            const error = errorFactory
                ? errorFactory([
                      new ErrorField('Content-Type header', [
                          `Content-Type ${contentType} is not allowed. Use [${allowedContentTypes.join(
                              ', '
                          )}]`
                      ])
                  ])
                : new ErrorConstructor([
                      new ErrorField('Content-Type header', [
                          `Content-Type ${contentType} is not allowed. Use [${allowedContentTypes.join(
                              ', '
                          )}]`
                      ])
                  ]);

            next(error);
            return;
        }

        next();
    };
};
