import { BaseError } from '../../common/models/base-error.model';
import { ErrorField } from '../../common/models/error-field.model';
import { StatusCodes } from 'http-status-codes';

export class DefaultBodyError extends BaseError {
    constructor(public readonly fields: ErrorField[]) {
        super(StatusCodes.BAD_REQUEST, 'Received invalid values');
    }
}
