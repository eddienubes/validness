import { StatusCodes } from 'http-status-codes';
import { BaseError, ErrorField } from '../../../common/errors';

export class DefaultQueryError extends BaseError {
    constructor(public readonly fields: ErrorField[]) {
        super(StatusCodes.BAD_REQUEST, 'Received invalid query parameters');
    }
}
