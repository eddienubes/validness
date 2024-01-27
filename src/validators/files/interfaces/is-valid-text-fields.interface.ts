import { ErrorField } from '@src/common/errors/error-field.js';
import { AnyObject } from '@src/common/types/types.js';

export interface IsValidTextFields {
    instance: AnyObject;
    violatedFields: ErrorField[];
}
