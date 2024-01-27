import { StatusCodes } from 'http-status-codes';
import { BaseHttpError, ErrorField, ValidationErrorsCollectable } from '@src/index.js';

export class DefaultFileError extends BaseHttpError implements ValidationErrorsCollectable {
    constructor(public readonly fields: ErrorField[]) {
        super(StatusCodes.BAD_REQUEST, 'Received invalid form data parameters');
    }
}
