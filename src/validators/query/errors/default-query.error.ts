import { StatusCodes } from 'http-status-codes';
import { ValidationError } from 'class-validator';
import { BaseHttpError } from '../../../common/errors/base-http.error.ts';
import { ValidationErrorsCollectable } from '../../../common/interfaces/validation-errors-collectable.interface.ts';
import { ErrorField } from '../../../common/errors/error-field.ts';

export class DefaultQueryError
    extends BaseHttpError
    implements ValidationErrorsCollectable
{
    constructor(
        public readonly fields: ErrorField[],
        public readonly rawValidatorErrors: ValidationError[]
    ) {
        super(StatusCodes.BAD_REQUEST, 'Received invalid query parameters');
    }
}
