import { RequestHandler } from 'express';
import { ValidationErrorsCollectable } from '@src/common/interfaces/validation-errors-collectable.interface';
import { ClassConstructor, CustomErrorFactory } from '@src';

export const contentTypeValidationMiddleware = (
    allowedContentTypes: string[],
    ErrorConstructor: ClassConstructor<ValidationErrorsCollectable>,
    errorFactory?: CustomErrorFactory
): RequestHandler => {
    return (req, res, next) => {
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
