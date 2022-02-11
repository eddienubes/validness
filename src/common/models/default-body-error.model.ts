import { BaseError } from './base-error.model';
import { ErrorField } from './error-field.model';
import { StatusCodes } from 'http-status-codes';

export class DefaultBodyErrorModel extends BaseError {
    constructor(public readonly fields: ErrorField[]) {
        super(StatusCodes.BAD_REQUEST, 'Received invalid body fields');
    }
}
