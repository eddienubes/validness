import { ErrorField } from './error-field.model';

export class UserCustomError {
    constructor(public readonly errors: ErrorField[]) {}
}
