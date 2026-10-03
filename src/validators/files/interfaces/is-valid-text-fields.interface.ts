import { ErrorField } from '../../../common/errors/error-field.ts';
import { AnyObject } from '../../../common/types/types.ts';

export interface IsValidTextFields {
    instance: AnyObject;
    violatedFields: ErrorField[];
}
