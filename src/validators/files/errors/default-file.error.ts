import { StatusCodes } from 'http-status-codes';
import { BaseError, ErrorField } from '@src';

export class DefaultFileError extends BaseError {
    constructor(public readonly fields: ErrorField[]) {
        super(StatusCodes.BAD_REQUEST, 'Received invalid form data parameters');
    }
}
