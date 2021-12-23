import { BaseError } from '../../common/models/BaseError';
import { ErrorField } from './error-body-field.model';
import { StatusCodes } from 'http-status-codes';

export class DefaultBodyErrorModel extends BaseError {
  constructor(public readonly fields: ErrorField[]) {
    super(StatusCodes.BAD_REQUEST, 'Received invalid values');
  }
}