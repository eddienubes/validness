import { ErrorField } from '../errors/error-field.ts';

export interface ValidationErrorsCollectable {
    fields: ErrorField[];
}
