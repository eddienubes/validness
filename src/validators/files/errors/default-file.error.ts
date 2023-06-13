import { StatusCodes } from 'http-status-codes';
import { ErrorField } from '@src';
import { BaseHttpError } from '@src/common/errors/base-http.error';
import { ValidationErrorsCollectable } from '@src/common/interfaces/validation-errors-collectable.interface';

export class DefaultFileError extends BaseHttpError implements ValidationErrorsCollectable {
    constructor(public readonly fields: ErrorField[]) {
        super(StatusCodes.BAD_REQUEST, 'Received invalid form data parameters');
    }
}
