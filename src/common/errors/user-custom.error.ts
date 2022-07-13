import { ErrorField } from '../models';

export class UserCustomError {
    constructor(public readonly errors: ErrorField[]) {}
}
