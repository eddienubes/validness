import { RequestHandler } from 'express';
import { ValidationErrorsCollectable } from '@src/common/interfaces/validation-errors-collectable.interface';
import { ClassConstructor } from '@src';

export const contentTypeValidationMiddleware = (
    allowedContentTypes: string[],
    ErrorConstructor: ClassConstructor<ValidationErrorsCollectable>
): RequestHandler => {
    return (req, res, next) => {
        const contentType = req.headers['content-type'];

        if (!allowedContentTypes.length) {
            next();
            return;
        }

        if (!contentType) {
            throw new ErrorConstructor([
                {
                    field: 'Content-Type header',
                    violations: ['Content-Type header should be present']
                }
            ]);
        }

        if (!allowedContentTypes.some((ct) => contentType.includes(ct))) {
            throw new ErrorConstructor([
                {
                    field: 'Content-Type header',
                    violations: [
                        `Content-Type ${contentType} is not allowed. Use [${allowedContentTypes.join(', ')}]`
                    ]
                }
            ]);
        }

        next();
    };
};
