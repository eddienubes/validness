import { StatusCodes } from 'http-status-codes';
import {
    BaseHttpError,
    ErrorField,
    ValidationErrorsCollectable
} from '@src/index.js';
import { ValidationError } from 'class-validator';

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
