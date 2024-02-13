import { RequestHandler } from 'express';
import {
    ClassConstructor,
    ValidationConfigType,
    ValidationErrorsCollectable,
    ValidatorConfigurable
} from '@src/index.js';
import { ConfigStore } from '@src/config/config-store.js';

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
                      {
                          field: 'Content-Type header',
                          violations: ['Content-Type header should be present']
                      }
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
                      {
                          field: 'Content-Type header',
                          violations: [
                              `Content-Type ${contentType} is not allowed. Use [${allowedContentTypes.join(
                                  ', '
                              )}]`
                          ]
                      }
                  ])
                : new ErrorConstructor([
                      {
                          field: 'Content-Type header',
                          violations: [
                              `Content-Type ${contentType} is not allowed. Use [${allowedContentTypes.join(
                                  ', '
                              )}]`
                          ]
                      }
                  ]);

            next(error);
            return;
        }

        next();
    };
};
