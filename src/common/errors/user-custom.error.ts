import { ErrorField } from './error-field';

export class UserCustomError {
    constructor(public readonly errors: ErrorField[]) {}
}
