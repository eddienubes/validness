import { StatusCodes } from 'http-status-codes';
import { BaseHttpError } from '@src/common/errors/base-http.error.js';
import { ValidationErrorsCollectable } from '@src/common/interfaces/validation-errors-collectable.interface.js';
import { ErrorField } from '@src/common/errors/error-field.js';
import { ValidationError } from 'class-validator';

export class DefaultBodyError
    extends BaseHttpError
    implements ValidationErrorsCollectable
{
    constructor(
        public readonly fields: ErrorField[],
        public readonly rawValidatorErrors: ValidationError[]
    ) {
        super(StatusCodes.BAD_REQUEST, 'Received invalid values');
    }
}
